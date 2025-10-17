import {
  Subscription,
  SubscriptionPlanId,
  SubscriptionStatus,
} from '../../domain/entities/subscription.entity';

/**
 * Builder for creating Subscription test instances with fluent API
 *
 * Provides preset methods for common plans (BETA, STARTER, PRO)
 * and allows customization of specific fields
 *
 * Usage:
 * ```typescript
 * // STARTER plan subscription
 * const sub = new SubscriptionBuilder().withStarterPlan().build();
 *
 * // PRO plan with custom club ID
 * const sub = new SubscriptionBuilder()
 *   .withProPlan()
 *   .withClubId('my-club')
 *   .build();
 *
 * // Canceled subscription
 * const sub = new SubscriptionBuilder()
 *   .withStarterPlan()
 *   .withCanceledStatus()
 *   .build();
 * ```
 */
export class SubscriptionBuilder {
  private props: {
    id: string;
    clubId: string;
    planId: SubscriptionPlanId;
    status?: SubscriptionStatus;
    maxTeams: number | null;
    price: number;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };

  constructor() {
    // Default to STARTER plan
    this.props = {
      id: 'subscription-1',
      clubId: 'club-1',
      planId: SubscriptionPlanId.STARTER,
      maxTeams: 1,
      price: 500,
      stripeCustomerId: 'cus_123',
      stripeSubscriptionId: 'sub_123',
    };
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withClubId(clubId: string): this {
    this.props.clubId = clubId;
    return this;
  }

  /**
   * Configure as BETA plan (free, unlimited teams)
   */
  withBetaPlan(): this {
    this.props.planId = SubscriptionPlanId.BETA;
    this.props.maxTeams = null;
    this.props.price = 0;
    this.props.stripeCustomerId = null;
    this.props.stripeSubscriptionId = null;
    return this;
  }

  /**
   * Configure as STARTER plan (5€/month, 1 team)
   */
  withStarterPlan(): this {
    this.props.planId = SubscriptionPlanId.STARTER;
    this.props.maxTeams = 1;
    this.props.price = 500;
    this.props.stripeCustomerId = this.props.stripeCustomerId || 'cus_123';
    this.props.stripeSubscriptionId =
      this.props.stripeSubscriptionId || 'sub_123';
    return this;
  }

  /**
   * Configure as PRO plan (15€/month, 5 teams)
   */
  withProPlan(): this {
    this.props.planId = SubscriptionPlanId.PRO;
    this.props.maxTeams = 5;
    this.props.price = 1500;
    this.props.stripeCustomerId = this.props.stripeCustomerId || 'cus_456';
    this.props.stripeSubscriptionId =
      this.props.stripeSubscriptionId || 'sub_456';
    return this;
  }

  withStripeCustomerId(stripeCustomerId: string | null): this {
    this.props.stripeCustomerId = stripeCustomerId;
    return this;
  }

  withStripeSubscriptionId(stripeSubscriptionId: string | null): this {
    this.props.stripeSubscriptionId = stripeSubscriptionId;
    return this;
  }

  /**
   * Set status to ACTIVE
   */
  withActiveStatus(): this {
    this.props.status = SubscriptionStatus.ACTIVE;
    return this;
  }

  /**
   * Set status to CANCELED
   */
  withCanceledStatus(): this {
    this.props.status = SubscriptionStatus.CANCELED;
    return this;
  }

  /**
   * Set status to INACTIVE
   */
  withInactiveStatus(): this {
    this.props.status = SubscriptionStatus.INACTIVE;
    return this;
  }

  /**
   * Set status to PAYMENT_FAILED
   */
  withPaymentFailedStatus(): this {
    this.props.status = SubscriptionStatus.PAYMENT_FAILED;
    return this;
  }

  /**
   * Set cancelAtPeriodEnd flag
   */
  withCancelAtPeriodEnd(cancelAtPeriodEnd: boolean): this {
    this.props.cancelAtPeriodEnd = cancelAtPeriodEnd;
    return this;
  }

  /**
   * Set current period dates
   */
  withCurrentPeriod(start: Date, end: Date): this {
    this.props.currentPeriodStart = start;
    this.props.currentPeriodEnd = end;
    return this;
  }

  /**
   * Set timestamps for reconstitution
   */
  withTimestamps(createdAt: Date, updatedAt: Date): this {
    this.props.createdAt = createdAt;
    this.props.updatedAt = updatedAt;
    return this;
  }

  /**
   * Build the Subscription entity
   */
  build(): Subscription {
    // Use reconstitute if we have timestamps or status
    if (
      this.props.createdAt ||
      this.props.updatedAt ||
      this.props.status ||
      this.props.currentPeriodStart ||
      this.props.currentPeriodEnd ||
      this.props.cancelAtPeriodEnd !== undefined
    ) {
      return Subscription.reconstitute({
        id: this.props.id,
        clubId: this.props.clubId,
        planId: this.props.planId,
        status: this.props.status || SubscriptionStatus.ACTIVE,
        maxTeams: this.props.maxTeams,
        price: this.props.price,
        stripeCustomerId: this.props.stripeCustomerId ?? null,
        stripeSubscriptionId: this.props.stripeSubscriptionId ?? null,
        currentPeriodStart: this.props.currentPeriodStart || new Date(),
        currentPeriodEnd: this.props.currentPeriodEnd || new Date(),
        cancelAtPeriodEnd: this.props.cancelAtPeriodEnd || false,
        createdAt: this.props.createdAt || new Date(),
        updatedAt: this.props.updatedAt || new Date(),
      });
    }

    // Use create for new subscriptions
    return Subscription.create({
      id: this.props.id,
      clubId: this.props.clubId,
      planId: this.props.planId,
      maxTeams: this.props.maxTeams,
      price: this.props.price,
      stripeCustomerId: this.props.stripeCustomerId ?? undefined,
      stripeSubscriptionId: this.props.stripeSubscriptionId ?? undefined,
    });
  }
}
