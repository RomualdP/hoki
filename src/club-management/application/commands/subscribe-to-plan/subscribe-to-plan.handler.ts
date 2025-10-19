/**
 * SubscribeToPlanHandler - CQRS Command Handler
 */

import {
  ClubNotFoundException,
  SubscriptionAlreadyActiveException,
} from '../../../domain/exceptions';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { SubscribeToPlanCommand } from './subscribe-to-plan.command';
import { Subscription } from '../../../domain/entities/subscription.entity';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../domain/repositories/subscription.repository';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../domain/repositories/club.repository';
import { SubscriptionPlans } from '../../../domain/value-objects/subscription-plan.vo';
import { randomUUID } from 'crypto';

@Injectable()
@CommandHandler(SubscribeToPlanCommand)
export class SubscribeToPlanHandler
  implements ICommandHandler<SubscribeToPlanCommand, string>
{
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(CLUB_REPOSITORY)
    private readonly clubRepository: IClubRepository,
  ) {}

  async execute(command: SubscribeToPlanCommand): Promise<string> {
    // 1. Verify club exists
    const club = await this.clubRepository.findById(command.clubId);
    if (!club) {
      throw new ClubNotFoundException(command.clubId);
    }

    // 2. Check if club already has a subscription
    const existingSubscription = await this.subscriptionRepository.findByClubId(
      command.clubId,
    );
    if (existingSubscription) {
      throw new SubscriptionAlreadyActiveException();
    }

    // 3. Get plan configuration
    const plan = SubscriptionPlans.getById(command.planId);

    // 4. Create subscription entity
    const subscription = Subscription.create({
      id: randomUUID(),
      clubId: command.clubId,
      planId: plan.id,
      maxTeams: plan.maxTeams,
      price: plan.price,
      stripeCustomerId: command.stripeCustomerId,
      stripeSubscriptionId: command.stripeSubscriptionId,
    });

    // 5. Persist subscription
    const savedSubscription =
      await this.subscriptionRepository.save(subscription);

    // 6. Return subscription ID
    return savedSubscription.id;
  }
}
