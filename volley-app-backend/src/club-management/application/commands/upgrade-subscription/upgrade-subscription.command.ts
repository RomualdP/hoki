import { SubscriptionPlanId } from '../../../domain/entities/subscription.entity';

export class UpgradeSubscriptionCommand {
  constructor(
    public readonly subscriptionId: string,
    public readonly newPlanId: SubscriptionPlanId,
  ) {}
}
