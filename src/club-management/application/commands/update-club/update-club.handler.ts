/**
 * UpdateClubHandler - CQRS Command Handler
 */

import { ClubNotFoundException } from '../../../domain/exceptions';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateClubCommand } from './update-club.command';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../domain/repositories/club.repository';

@Injectable()
@CommandHandler(UpdateClubCommand)
export class UpdateClubHandler
  implements ICommandHandler<UpdateClubCommand, void>
{
  constructor(
    @Inject(CLUB_REPOSITORY)
    private readonly clubRepository: IClubRepository,
  ) {}

  async execute(command: UpdateClubCommand): Promise<void> {
    // 1. Find club
    const club = await this.clubRepository.findById(command.clubId);
    if (!club) {
      throw new ClubNotFoundException(command.clubId);
    }

    // 2. Update club (domain logic handles validations)
    club.update({
      name: command.name,
      description: command.description,
      logo: command.logo,
      location: command.location,
    });

    // 3. Persist changes
    await this.clubRepository.update(club);
  }
}
