import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetClubQuery } from './get-club.query';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../domain/repositories/club.repository';
import { ClubDetailReadModel } from '../../read-models/club-detail.read-model';

@Injectable()
@QueryHandler(GetClubQuery)
export class GetClubHandler
  implements IQueryHandler<GetClubQuery, ClubDetailReadModel>
{
  constructor(
    @Inject(CLUB_REPOSITORY)
    private readonly clubRepository: IClubRepository,
  ) {}

  async execute(query: GetClubQuery): Promise<ClubDetailReadModel> {
    const club = await this.clubRepository.findById(query.clubId);
    if (!club) {
      throw new NotFoundException(`Club with ID ${query.clubId} not found`);
    }

    // Map domain entity to read model (optimized for UI)
    return {
      id: club.id,
      name: club.name,
      description: club.description,
      logo: club.logo,
      location: club.location,
      ownerId: club.ownerId,
      createdAt: club.createdAt,
      updatedAt: club.updatedAt,
    };
  }
}
