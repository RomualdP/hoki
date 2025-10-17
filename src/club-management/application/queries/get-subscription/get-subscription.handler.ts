import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetSubscriptionQuery } from './get-subscription.query';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../domain/repositories/subscription.repository';
import { SubscriptionStatusReadModel } from '../../read-models/subscription-status.read-model';

@Injectable()
@QueryHandler(GetSubscriptionQuery)
export class GetSubscriptionHandler
  implements IQueryHandler<GetSubscriptionQuery, SubscriptionStatusReadModel>
{
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(
    query: GetSubscriptionQuery,
  ): Promise<SubscriptionStatusReadModel> {
    const subscription = await this.subscriptionRepository.findByClubId(
      query.clubId,
    );
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return {
      id: subscription.id,
      clubId: subscription.clubId,
      planId: subscription.planId,
      status: subscription.status,
      maxTeams: subscription.maxTeams,
      price: subscription.price,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      isActive: subscription.isActive(),
      hasUnlimitedTeams: subscription.hasUnlimitedTeams(),
    };
  }
}
