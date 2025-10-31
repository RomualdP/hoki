import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  InvitationNotFoundException,
  InvitationExpiredException,
  InvitationAlreadyUsedException,
} from '../../../domain/exceptions';
import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { AcceptInvitationCommand } from './accept-invitation.command';
import { Member } from '../../../domain/entities/member.entity';
import { ClubRole } from '../../../domain/value-objects/club-role.vo';
import {
  IInvitationRepository,
  INVITATION_REPOSITORY,
} from '../../../domain/repositories/invitation.repository';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository';
import { InvitationType } from '../../../domain/value-objects/invitation-type.vo';
import { randomUUID } from 'crypto';

@Injectable()
@CommandHandler(AcceptInvitationCommand)
export class AcceptInvitationHandler
  implements ICommandHandler<AcceptInvitationCommand, string>
{
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly invitationRepository: IInvitationRepository,
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(command: AcceptInvitationCommand): Promise<string> {
    // 1. Find and validate invitation
    const invitation = await this.invitationRepository.findByToken(
      command.token,
    );
    if (!invitation) {
      throw new InvitationNotFoundException();
    }

    // 2. Validate invitation
    invitation.validateUserIsNotCreator(command.userId);
    if (!invitation.isValid()) {
      if (invitation.isExpired()) {
        throw new InvitationExpiredException();
      } else {
        throw new InvitationAlreadyUsedException();
      }
    }

    // 3. Mark invitation as used
    invitation.markAsUsed(command.userId);
    await this.invitationRepository.update(invitation);

    // 4. Map invitation type to club role
    const role = this.mapInvitationTypeToClubRole(invitation.type);

    // 5. Validate that there is no active COACH if role is COACH
    if (role === ClubRole.COACH) {
      const existingCoaches =
        await this.memberRepository.findActiveByClubIdAndRole(
          invitation.clubId,
          ClubRole.COACH,
        );
      if (existingCoaches && existingCoaches.length > 0) {
        throw new ForbiddenException(
          'A club can only have one active COACH member',
        );
      }
    }

    // 6. Create member entity
    const member = Member.create({
      id: randomUUID(),
      userId: command.userId,
      clubId: invitation.clubId,
      role,
      invitedBy: invitation.createdBy,
    });

    // 7. Persist member
    const savedMember = await this.memberRepository.save(member);

    // 8. Return member ID
    return savedMember.id;
  }

  private mapInvitationTypeToClubRole(type: InvitationType): ClubRole {
    const mapping = {
      [InvitationType.PLAYER]: ClubRole.PLAYER,
      [InvitationType.COACH]: ClubRole.COACH,
    };

    return mapping[type];
  }
}
