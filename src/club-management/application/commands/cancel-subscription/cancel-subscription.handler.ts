import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CancelSubscriptionCommand } from './cancel-subscription.command';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../domain/repositories/subscription.repository';

@Injectable()
@CommandHandler(CancelSubscriptionCommand)
export class CancelSubscriptionHandler
  implements ICommandHandler<CancelSubscriptionCommand, void>
{
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(command: CancelSubscriptionCommand): Promise<void> {
    const subscription = await this.subscriptionRepository.findById(
      command.subscriptionId,
    );
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.cancel();
    await this.subscriptionRepository.update(subscription);
  }
}
