import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ChangeClubCommand } from './change-club.command';
import { Member } from '../../../domain/entities/member.entity';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../domain/repositories/club.repository';
import { ClubTransferService } from '../../../domain/services/club-transfer.service';
import { randomUUID } from 'crypto';

@Injectable()
@CommandHandler(ChangeClubCommand)
export class ChangeClubHandler
  implements ICommandHandler<ChangeClubCommand, string>
{
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
    @Inject(CLUB_REPOSITORY)
    private readonly clubRepository: IClubRepository,
    private readonly clubTransferService: ClubTransferService,
  ) {}

  async execute(command: ChangeClubCommand): Promise<string> {
    // 1. Find current active membership
    const currentMember = await this.memberRepository.findActiveByUserId(
      command.userId,
    );
    if (!currentMember) {
      throw new NotFoundException('User has no active club membership');
    }

    // 2. Verify new club exists
    const newClub = await this.clubRepository.findById(command.newClubId);
    if (!newClub) {
      throw new NotFoundException('New club not found');
    }

    // 3. Execute transfer (domain service handles validations)
    const updatedMember = this.clubTransferService.executeTransfer({
      currentMember,
      newClubId: command.newClubId,
      newMemberId: randomUUID(),
    });

    // 4. Update old membership
    await this.memberRepository.update(updatedMember);

    // 5. Create new membership (player role in new club)
    const newMember = Member.create({
      id: randomUUID(),
      userId: command.userId,
      clubId: command.newClubId,
      role: currentMember.role, // Keep same role
    });

    const savedNewMember = await this.memberRepository.save(newMember);

    // 6. Return new member ID
    return savedNewMember.id;
  }
}
