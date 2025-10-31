import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  MemberNotFoundException,
  CannotRemoveSelfException,
} from '../../../domain/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { RemoveMemberCommand } from './remove-member.command';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository';

@Injectable()
@CommandHandler(RemoveMemberCommand)
export class RemoveMemberHandler
  implements ICommandHandler<RemoveMemberCommand, void>
{
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(command: RemoveMemberCommand): Promise<void> {
    // 1. Find member to remove
    const member = await this.memberRepository.findById(command.memberId);
    if (!member) {
      throw new MemberNotFoundException();
    }

    // 2. Find remover (to check permissions)
    const remover = await this.memberRepository.findByUserIdAndClubId(
      command.removerId,
      member.clubId,
    );
    if (!remover) {
      throw new MemberNotFoundException('Remover not found in club');
    }

    // 3. Check if trying to remove self
    if (member.userId === remover.userId) {
      throw new CannotRemoveSelfException();
    }

    // 4. Validate removal permissions (domain logic)
    member.validateCanBeRemovedBy(remover.role);

    // 5. Mark member as left
    member.markAsLeft();

    // 6. Persist changes
    await this.memberRepository.update(member);
  }
}
