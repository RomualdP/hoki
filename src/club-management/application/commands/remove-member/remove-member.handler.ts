import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RemoveMemberCommand } from './remove-member.command';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository';
import { ClubRole } from '../../../domain/entities/member.entity';

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
      throw new NotFoundException('Member not found');
    }

    // 2. Find remover (to check permissions)
    const remover = await this.memberRepository.findByUserIdAndClubId(
      command.removerId,
      member.clubId,
    );
    if (!remover) {
      throw new NotFoundException('Remover not found in club');
    }

    // 3. Validate removal permissions (domain logic)
    member.validateCanBeRemovedBy(remover.role);

    // 4. Mark member as left
    member.markAsLeft();

    // 5. Persist changes
    await this.memberRepository.update(member);
  }
}
