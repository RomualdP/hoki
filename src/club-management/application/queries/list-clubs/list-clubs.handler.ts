import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { ListClubsQuery } from './list-clubs.query';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../domain/repositories/club.repository';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../domain/repositories/subscription.repository';
import { ClubListReadModel } from '../../read-models/club-list.read-model';

@Injectable()
@QueryHandler(ListClubsQuery)
export class ListClubsHandler
  implements IQueryHandler<ListClubsQuery, ClubListReadModel[]>
{
  constructor(
    @Inject(CLUB_REPOSITORY)
    private readonly clubRepository: IClubRepository,
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(query: ListClubsQuery): Promise<ClubListReadModel[]> {
    const clubs = await this.clubRepository.findAll({
      skip: query.skip,
      take: query.take,
      searchTerm: query.searchTerm,
    });

    // Fetch aggregated data for all clubs in parallel
    const clubsWithData = await Promise.all(
      clubs.map(async (club) => {
        const [memberCount, subscription] = await Promise.all([
          this.memberRepository.countByClubId(club.id),
          this.subscriptionRepository.findByClubId(club.id),
        ]);

        return {
          id: club.id,
          name: club.name,
          description: club.description,
          logo: club.logo,
          location: club.location,
          ownerId: club.ownerId,
          createdAt: club.createdAt,
          memberCount,
          teamCount: 0, // NOTE: Team management not yet implemented in club-management bounded context
          subscriptionPlanName: subscription
            ? this.getPlanName(subscription.planId)
            : 'Free',
          subscriptionStatus: subscription ? subscription.status : 'INACTIVE',
        };
      }),
    );

    return clubsWithData;
  }

  private getPlanName(planId: string): string {
    const planNames: Record<string, string> = {
      BETA: 'Beta (Gratuit)',
      STARTER: 'Starter',
      PRO: 'Pro',
    };
    return planNames[planId] || planId;
  }
}
