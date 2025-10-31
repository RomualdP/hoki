/**
 * SubscribeToPlanCommand - CQRS Command
 */

import { SubscriptionPlanId } from '../../../domain/entities/subscription.entity';

export class SubscribeToPlanCommand {
  constructor(
    public readonly clubId: string,
    public readonly planId: SubscriptionPlanId,
    public readonly userId: string,
    public readonly stripeCustomerId?: string,
    public readonly stripeSubscriptionId?: string,
  ) {}
}
