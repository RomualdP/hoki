import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException('Subscription not found');
    }

    const newPlan = SubscriptionPlans.getById(command.newPlanId);
    subscription.upgrade(newPlan);

    await this.subscriptionRepository.update(subscription);
  }
}
