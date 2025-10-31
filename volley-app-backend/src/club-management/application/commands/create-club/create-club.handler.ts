/**
 * CreateClubHandler - CQRS Command Handler
 *
 * Handles the CreateClubCommand by orchestrating domain entities,
 * domain services, and repositories to create a new club.
 *
 * Responsibilities:
 * - Validate business rules
 * - Create domain entity
 * - Persist to database via repository
 * - Return result
 */

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { CreateClubCommand } from './create-club.command';
import { Club } from '../../../domain/entities/club.entity';
import { Member } from '../../../domain/entities/member.entity';
import { ClubRole } from '../../../domain/value-objects/club-role.vo';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../domain/repositories/club.repository';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository';
import { randomUUID } from 'crypto';

@Injectable()
@CommandHandler(CreateClubCommand)
export class CreateClubHandler
  implements ICommandHandler<CreateClubCommand, string>
{
  constructor(
    @Inject(CLUB_REPOSITORY)
    private readonly clubRepository: IClubRepository,
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(command: CreateClubCommand): Promise<string> {
    // 1. Validate club name uniqueness
    const existingClubNames = await this.clubRepository.getAllClubNames();
    Club.validateNameUniqueness(command.name, existingClubNames);

    // 2. Create club entity (domain logic)
    const club = Club.create({
      id: randomUUID(),
      name: command.name,
      description: command.description || undefined,
      logo: command.logo || undefined,
      location: command.location || undefined,
      ownerId: command.ownerId,
    });

    // 3. Persist club via repository
    const savedClub = await this.clubRepository.save(club);

    // 4. Validate that there is no active OWNER in this club
    const existingOwners =
      await this.memberRepository.findActiveByClubIdAndRole(
        savedClub.id,
        ClubRole.OWNER,
      );
    if (existingOwners && existingOwners.length > 0) {
      throw new ForbiddenException(
        'A club can only have one active OWNER member',
      );
    }

    // 5. Create Member OWNER for the club owner
    const ownerMember = Member.create({
      id: randomUUID(),
      userId: command.ownerId,
      clubId: savedClub.id,
      role: ClubRole.OWNER,
    });

    // 6. Persist owner member
    await this.memberRepository.save(ownerMember);

    // 7. Return club ID (minimal return for commands)
    return savedClub.id;
  }
}
