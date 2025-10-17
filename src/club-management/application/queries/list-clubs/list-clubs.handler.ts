import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { ListClubsQuery } from './list-clubs.query';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../domain/repositories/club.repository';
import { ClubListReadModel } from '../../read-models/club-list.read-model';

@Injectable()
@QueryHandler(ListClubsQuery)
export class ListClubsHandler
  implements IQueryHandler<ListClubsQuery, ClubListReadModel[]>
{
  constructor(
    @Inject(CLUB_REPOSITORY)
    private readonly clubRepository: IClubRepository,
  ) {}

  async execute(query: ListClubsQuery): Promise<ClubListReadModel[]> {
    const clubs = await this.clubRepository.findAll({
      skip: query.skip,
      take: query.take,
      searchTerm: query.searchTerm,
    });

    return clubs.map((club) => ({
      id: club.id,
      name: club.name,
      description: club.description,
      logo: club.logo,
      location: club.location,
      ownerId: club.ownerId,
      createdAt: club.createdAt,
      // TODO: Implement member/team count aggregation from repositories
      memberCount: 0,
      teamCount: 0,
      subscriptionPlanName: 'Unknown', // TODO: Fetch from subscription repository
      subscriptionStatus: 'Unknown', // TODO: Fetch from subscription repository
    }));
  }
}
