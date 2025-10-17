/**
 * Subscription - Domain Entity (Rich Domain Model)
 *
 * Represents a club's subscription to a plan.
 * Encapsulates business logic related to subscription management and team creation limits.
 */

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELED = 'CANCELED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export enum SubscriptionPlanId {
  BETA = 'BETA', // Free unlimited plan for beta testers
  STARTER = 'STARTER', // 5€/month - 1 team
  PRO = 'PRO', // 15€/month - 5 teams
}

export interface SubscriptionPlanConfig {
  id: SubscriptionPlanId;
  name: string;
  price: number; // in cents
  maxTeams: number | null; // null = unlimited
  stripePriceId?: string; // Stripe Price ID (not needed for BETA)
}

export class Subscription {
  private constructor(
    public readonly id: string,
    public readonly clubId: string,
    public planId: SubscriptionPlanId,
    public maxTeams: number | null, // null = unlimited
    public price: number, // in cents
    public status: SubscriptionStatus,
    public stripeCustomerId: string | null,
    public stripeSubscriptionId: string | null,
    public currentPeriodStart: Date | null,
    public currentPeriodEnd: Date | null,
    public cancelAtPeriodEnd: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * Factory method to create a new Subscription
   */
  static create(props: {
    id: string;
    clubId: string;
    planId: SubscriptionPlanId;
    maxTeams: number | null;
    price: number;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
  }): Subscription {
    if (!props.clubId) {
      throw new Error('Subscription must be associated with a club');
    }

    if (props.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (props.maxTeams !== null && props.maxTeams < 0) {
      throw new Error('Max teams cannot be negative');
    }

    const now = new Date();

    return new Subscription(
      props.id,
      props.clubId,
      props.planId,
      props.maxTeams,
      props.price,
      SubscriptionStatus.ACTIVE,
      props.stripeCustomerId || null,
      props.stripeSubscriptionId || null,
      props.currentPeriodStart || now,
      props.currentPeriodEnd || null,
      false,
      now,
      now,
    );
  }

  /**
   * Factory method to reconstitute a Subscription from persistence
   */
  static reconstitute(props: {
    id: string;
    clubId: string;
    planId: SubscriptionPlanId;
    maxTeams: number | null;
    price: number;
    status: SubscriptionStatus;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Subscription {
    return new Subscription(
      props.id,
      props.clubId,
      props.planId,
      props.maxTeams,
      props.price,
      props.status,
      props.stripeCustomerId,
      props.stripeSubscriptionId,
      props.currentPeriodStart,
      props.currentPeriodEnd,
      props.cancelAtPeriodEnd,
      props.createdAt,
      props.updatedAt,
    );
  }

  /**
   * Business Logic: Check if the club can create a new team
   * based on the subscription plan limits
   *
   * @param currentTeamCount - Current number of teams the club has
   * @returns true if the club can create a new team, false otherwise
   */
  canCreateTeam(currentTeamCount: number): boolean {
    // Inactive or canceled subscriptions cannot create teams
    if (
      this.status === SubscriptionStatus.INACTIVE ||
      this.status === SubscriptionStatus.CANCELED
    ) {
      return false;
    }

    // BETA or unlimited plans can create unlimited teams
    if (this.maxTeams === null) {
      return true;
    }

    // Check if current team count is below the limit
    return currentTeamCount < this.maxTeams;
  }

  /**
   * Business Logic: Upgrade subscription to a higher plan
   *
   * @param newPlanConfig - Configuration of the new plan
   * @throws Error if upgrade is not valid
   */
  upgrade(newPlanConfig: SubscriptionPlanConfig): void {
    // Cannot upgrade from BETA to paid plans (must create new subscription)
    if (this.planId === SubscriptionPlanId.BETA) {
      throw new Error(
        'Cannot upgrade from BETA plan. Please subscribe to a paid plan.',
      );
    }

    // Validate upgrade path
    if (newPlanConfig.id === SubscriptionPlanId.BETA) {
      throw new Error('Cannot downgrade to BETA plan');
    }

    // Cannot "upgrade" to the same plan
    if (this.planId === newPlanConfig.id) {
      throw new Error('Already subscribed to this plan');
    }

    // Validate upgrade direction (prevent downgrades)
    const currentPlanOrder = this.getPlanOrder(this.planId);
    const newPlanOrder = this.getPlanOrder(newPlanConfig.id);

    if (newPlanOrder <= currentPlanOrder) {
      throw new Error(
        'Can only upgrade to a higher plan. Use cancel() to downgrade.',
      );
    }

    // Update subscription details
    this.planId = newPlanConfig.id;
    this.maxTeams = newPlanConfig.maxTeams;
    this.price = newPlanConfig.price;
    this.updatedAt = new Date();
  }

  /**
   * Cancel subscription (will remain active until period end)
   */
  cancel(): void {
    if (this.status === SubscriptionStatus.CANCELED) {
      throw new Error('Subscription is already canceled');
    }

    if (this.planId === SubscriptionPlanId.BETA) {
      // BETA subscriptions are canceled immediately
      this.status = SubscriptionStatus.CANCELED;
    } else {
      // Paid subscriptions remain active until period end
      this.cancelAtPeriodEnd = true;
    }

    this.updatedAt = new Date();
  }

  /**
   * Mark subscription as inactive (called when period ends and canceled)
   */
  markAsInactive(): void {
    this.status = SubscriptionStatus.INACTIVE;
    this.updatedAt = new Date();
  }

  /**
   * Mark subscription as payment failed
   */
  markAsPaymentFailed(): void {
    this.status = SubscriptionStatus.PAYMENT_FAILED;
    this.updatedAt = new Date();
  }

  /**
   * Reactivate subscription (after payment recovery)
   */
  reactivate(): void {
    if (this.status === SubscriptionStatus.ACTIVE) {
      throw new Error('Subscription is already active');
    }

    this.status = SubscriptionStatus.ACTIVE;
    this.cancelAtPeriodEnd = false;
    this.updatedAt = new Date();
  }

  /**
   * Update subscription from Stripe webhook
   */
  updateFromStripe(props: {
    status?: SubscriptionStatus;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  }): void {
    if (props.status !== undefined) {
      this.status = props.status;
    }

    if (props.currentPeriodStart !== undefined) {
      this.currentPeriodStart = props.currentPeriodStart;
    }

    if (props.currentPeriodEnd !== undefined) {
      this.currentPeriodEnd = props.currentPeriodEnd;
    }

    if (props.cancelAtPeriodEnd !== undefined) {
      this.cancelAtPeriodEnd = props.cancelAtPeriodEnd;
    }

    this.updatedAt = new Date();
  }

  /**
   * Check if subscription is active and can be used
   */
  isActive(): boolean {
    return this.status === SubscriptionStatus.ACTIVE;
  }

  /**
   * Check if subscription has unlimited teams
   */
  hasUnlimitedTeams(): boolean {
    return this.maxTeams === null;
  }

  /**
   * Get remaining teams that can be created
   */
  getRemainingTeams(currentTeamCount: number): number | null {
    if (this.maxTeams === null) {
      return null; // unlimited
    }

    return Math.max(0, this.maxTeams - currentTeamCount);
  }

  /**
   * Helper: Get plan order for upgrade validation
   */
  private getPlanOrder(planId: SubscriptionPlanId): number {
    const order = {
      [SubscriptionPlanId.BETA]: 0,
      [SubscriptionPlanId.STARTER]: 1,
      [SubscriptionPlanId.PRO]: 2,
    };

    return order[planId];
  }
}
