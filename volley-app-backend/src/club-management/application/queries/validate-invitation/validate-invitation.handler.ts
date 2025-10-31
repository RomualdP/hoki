import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ValidateInvitationQuery } from './validate-invitation.query';
import { InvitationDetailReadModel } from '../../read-models/invitation-detail.read-model';
import {
  IInvitationRepository,
  INVITATION_REPOSITORY,
} from '../../../domain/repositories/invitation.repository';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../domain/repositories/club.repository';

@Injectable()
@QueryHandler(ValidateInvitationQuery)
export class ValidateInvitationHandler
  implements IQueryHandler<ValidateInvitationQuery, InvitationDetailReadModel>
{
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly invitationRepository: IInvitationRepository,
    @Inject(CLUB_REPOSITORY)
    private readonly clubRepository: IClubRepository,
  ) {}

  async execute(
    query: ValidateInvitationQuery,
  ): Promise<InvitationDetailReadModel> {
    const invitation = await this.invitationRepository.findByToken(query.token);

    if (!invitation) {
      throw new NotFoundException(
        `Invitation with token ${query.token} not found`,
      );
    }

    const club = await this.clubRepository.findById(invitation.clubId);

    if (!club) {
      throw new NotFoundException(
        `Club ${invitation.clubId} associated with invitation not found`,
      );
    }

    const now = new Date();
    const remainingDays = Math.ceil(
      (invitation.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    const isExpired = invitation.isExpired();
    const isUsed = invitation.isUsed();
    const isValid = invitation.isValid();

    let status: 'valid' | 'expired' | 'used';
    if (isUsed) {
      status = 'used';
    } else if (isExpired) {
      status = 'expired';
    } else {
      status = 'valid';
    }

    return {
      id: invitation.id,
      token: invitation.token,
      type: invitation.type,
      clubId: club.id,
      clubName: club.name,
      expiresAt: invitation.expiresAt,
      remainingDays: remainingDays > 0 ? remainingDays : 0,
      status,
      createdBy: invitation.createdBy,
      createdAt: invitation.createdAt,
      usedAt: invitation.usedAt ?? undefined,
      usedBy: invitation.usedBy ?? undefined,
      isValid,
      isExpired,
      isUsed,
      canBeUsed: !isExpired && !isUsed,
    };
  }
}
