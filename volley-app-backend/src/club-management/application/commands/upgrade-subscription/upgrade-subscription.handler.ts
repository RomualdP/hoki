import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionNotFoundException } from '../../../domain/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { UpgradeSubscriptionCommand } from './upgrade-subscription.command';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../domain/repositories/subscription.repository';
import { SubscriptionPlans } from '../../../domain/value-objects/subscription-plan.vo';

@Injectable()
@CommandHandler(UpgradeSubscriptionCommand)
export class UpgradeSubscriptionHandler
  implements ICommandHandler<UpgradeSubscriptionCommand, void>
{
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(command: UpgradeSubscriptionCommand): Promise<void> {
    const subscription = await this.subscriptionRepository.findById(
      command.subscriptionId,
    );
    if (!subscription) {
      throw new SubscriptionNotFoundException();
    }

    const newPlan = SubscriptionPlans.getById(command.newPlanId);

    // Map SubscriptionPlan VO to SubscriptionPlanConfig
    const planConfig = {
      id: newPlan.id,
      name: newPlan.name,
      price: newPlan.price,
      maxTeams: newPlan.maxTeams,
      stripePriceId: newPlan.stripePriceId || undefined,
    };

    subscription.upgrade(planConfig);

    await this.subscriptionRepository.update(subscription);
  }
}
