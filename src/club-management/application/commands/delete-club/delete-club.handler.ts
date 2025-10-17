/**
 * DeleteClubHandler - CQRS Command Handler
 */

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DeleteClubCommand } from './delete-club.command';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../domain/repositories/club.repository';

@Injectable()
@CommandHandler(DeleteClubCommand)
export class DeleteClubHandler
  implements ICommandHandler<DeleteClubCommand, void>
{
  constructor(
    @Inject(CLUB_REPOSITORY)
    private readonly clubRepository: IClubRepository,
  ) {}

  async execute(command: DeleteClubCommand): Promise<void> {
    // 1. Find club
    const club = await this.clubRepository.findById(command.clubId);
    if (!club) {
      throw new NotFoundException(`Club with ID ${command.clubId} not found`);
    }

    // 2. Verify ownership (only owner can delete)
    if (!club.isOwner(command.requesterId)) {
      throw new ForbiddenException('Only the club owner can delete the club');
    }

    // 3. Delete club
    // Note: In a real implementation, you might want to:
    // - Cancel active subscription first
    // - Archive data instead of hard delete
    // - Send notifications to members
    await this.clubRepository.delete(command.clubId);
  }
}
