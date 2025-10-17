import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetSubscriptionQuery } from './get-subscription.query';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../domain/repositories/subscription.repository';
import { SubscriptionStatusReadModel } from '../../read-models/subscription-status.read-model';
import { SubscriptionStatus } from '../../../domain/entities/subscription.entity';

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

    // Calculate remaining days
    const now = new Date();
    const periodEnd = subscription.currentPeriodEnd || now;
    const remainingMs = periodEnd.getTime() - now.getTime();
    const remainingDays = Math.max(
      0,
      Math.ceil(remainingMs / (1000 * 60 * 60 * 24)),
    );

    // Get plan name
    const planNames = {
      BETA: 'Beta',
      STARTER: 'Starter',
      PRO: 'Pro',
    };
    const planName = planNames[subscription.planId] || subscription.planId;

    // Format price
    const formattedPrice =
      subscription.price === 0
        ? 'Gratuit'
        : `${(subscription.price / 100).toFixed(2).replace('.', ',')} €`;

    return {
      id: subscription.id,
      clubId: subscription.clubId,
      planId: subscription.planId,
      planName,
      status: subscription.status,
      maxTeams: subscription.maxTeams,
      price: subscription.price,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      currentPeriodStart: subscription.currentPeriodStart || new Date(),
      currentPeriodEnd: subscription.currentPeriodEnd || new Date(),
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      isActive: subscription.isActive(),
      isCanceled: subscription.status === SubscriptionStatus.CANCELED,
      remainingDays,
      formattedPrice,
      hasUnlimitedTeams: subscription.hasUnlimitedTeams(),
    };
  }
}
