import {
  SubscriptionPlanNameEmptyException,
  SubscriptionPlanPriceNegativeException,
  SubscriptionPlanMaxTeamsNegativeException,
  SubscriptionPlanNotFoundException,
} from '../exceptions';

/**
 * SubscriptionPlan - Value Object
 *
 * Immutable value object representing a subscription plan configuration.
 * Contains all plan details including pricing and team limits.
 */

import { SubscriptionPlanId } from '../entities/subscription.entity';

export class SubscriptionPlan {
  private constructor(
    public readonly id: SubscriptionPlanId,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number, // in cents
    public readonly maxTeams: number | null, // null = unlimited
    public readonly stripePriceId: string | null,
    public readonly features: string[],
  ) {}

  /**
   * Factory method to create a SubscriptionPlan value object
   */
  static create(props: {
    id: SubscriptionPlanId;
    name: string;
    description: string;
    price: number;
    maxTeams: number | null;
    stripePriceId?: string;
    features: string[];
  }): SubscriptionPlan {
    if (!props.name || props.name.trim().length === 0) {
      throw new SubscriptionPlanNameEmptyException();
    }

    if (props.price < 0) {
      throw new SubscriptionPlanPriceNegativeException();
    }

    if (props.maxTeams !== null && props.maxTeams < 0) {
      throw new SubscriptionPlanMaxTeamsNegativeException();
    }

    return new SubscriptionPlan(
      props.id,
      props.name.trim(),
      props.description.trim(),
      props.price,
      props.maxTeams,
      props.stripePriceId || null,
      props.features,
    );
  }

  /**
   * Check if plan is free (price = 0)
   */
  isFree(): boolean {
    return this.price === 0;
  }

  /**
   * Check if plan has unlimited teams
   */
  hasUnlimitedTeams(): boolean {
    return this.maxTeams === null;
  }

  /**
   * Get price in euros (converted from cents)
   */
  getPriceInEuros(): number {
    return this.price / 100;
  }

  /**
   * Get formatted price string
   */
  getFormattedPrice(): string {
    if (this.isFree()) {
      return 'Free';
    }

    return `${this.getPriceInEuros().toFixed(2)}€/month`;
  }

  /**
   * Compare with another plan to check if it's an upgrade
   *
   * @param otherPlan - The plan to compare with
   * @returns true if this plan is higher than the other
   */
  isUpgradeFrom(otherPlan: SubscriptionPlan): boolean {
    const planOrder = {
      [SubscriptionPlanId.BETA]: 0,
      [SubscriptionPlanId.STARTER]: 1,
      [SubscriptionPlanId.PRO]: 2,
    };

    return planOrder[this.id] > planOrder[otherPlan.id];
  }

  /**
   * Value object equality
   */
  equals(other: SubscriptionPlan): boolean {
    return this.id === other.id;
  }
}

/**
 * Available subscription plans catalog
 */
export class SubscriptionPlans {
  /**
   * BETA Plan - Free unlimited plan for beta testers
   */
  static readonly BETA = SubscriptionPlan.create({
    id: SubscriptionPlanId.BETA,
    name: 'Beta',
    description: 'Free unlimited plan for early adopters and beta testers',
    price: 0,
    maxTeams: null, // unlimited
    features: [
      'Unlimited teams',
      'All features included',
      'Priority support',
      'Early access to new features',
    ],
  });

  /**
   * STARTER Plan - 5€/month, 1 team
   */
  static readonly STARTER = SubscriptionPlan.create({
    id: SubscriptionPlanId.STARTER,
    name: 'Starter',
    description: 'Perfect for small clubs getting started',
    price: 500, // 5€ in cents
    maxTeams: 1,
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || undefined,
    features: [
      '1 team',
      'Match management',
      'Player statistics',
      'Basic support',
    ],
  });

  /**
   * PRO Plan - 15€/month, 5 teams
   */
  static readonly PRO = SubscriptionPlan.create({
    id: SubscriptionPlanId.PRO,
    name: 'Pro',
    description: 'For clubs managing multiple teams',
    price: 1500, // 15€ in cents
    maxTeams: 5,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || undefined,
    features: [
      '5 teams',
      'Match management',
      'Advanced statistics',
      'Tournament management',
      'Priority support',
      'Custom reports',
    ],
  });

  /**
   * Get all available plans
   */
  static getAll(): SubscriptionPlan[] {
    return [this.BETA, this.STARTER, this.PRO];
  }

  /**
   * Get all paid plans (excluding BETA)
   */
  static getPaidPlans(): SubscriptionPlan[] {
    return [this.STARTER, this.PRO];
  }

  /**
   * Get plan by ID
   */
  static getById(planId: SubscriptionPlanId): SubscriptionPlan {
    const plans = {
      [SubscriptionPlanId.BETA]: this.BETA,
      [SubscriptionPlanId.STARTER]: this.STARTER,
      [SubscriptionPlanId.PRO]: this.PRO,
    };

    const plan = plans[planId];
    if (!plan) {
      throw new SubscriptionPlanNotFoundException(planId);
    }

    return plan;
  }

  /**
   * Get plan by Stripe Price ID
   */
  static getByStripePriceId(stripePriceId: string): SubscriptionPlan | null {
    const allPlans = this.getAll();
    return (
      allPlans.find((plan) => plan.stripePriceId === stripePriceId) || null
    );
  }
}
