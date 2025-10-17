import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AcceptInvitationCommand } from './accept-invitation.command';
import { Member } from '../../../domain/entities/member.entity';
import {
  IInvitationRepository,
  INVITATION_REPOSITORY,
} from '../../../domain/repositories/invitation.repository';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository';
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
      throw new NotFoundException('Invitation not found');
    }

    // 2. Validate invitation
    invitation.validateUserIsNotCreator(command.userId);
    if (!invitation.isValid()) {
      throw new Error(
        invitation.isExpired()
          ? 'Invitation has expired'
          : 'Invitation has already been used',
      );
    }

    // 3. Mark invitation as used
    invitation.markAsUsed(command.userId);
    await this.invitationRepository.update(invitation);

    // 4. Create member entity
    const member = Member.create({
      id: randomUUID(),
      userId: command.userId,
      clubId: invitation.clubId,
      role: invitation.type.toClubRole(),
      invitedBy: invitation.createdBy,
    });

    // 5. Persist member
    const savedMember = await this.memberRepository.save(member);

    // 6. Return member ID
    return savedMember.id;
  }
}
