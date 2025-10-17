/**
 * ISubscriptionRepository - Domain Repository Interface
 *
 * Defines the contract for Subscription persistence operations.
 * This interface belongs to the Domain layer and will be implemented
 * in the Infrastructure layer.
 */

import {
  Subscription,
  SubscriptionPlanId,
} from '../entities/subscription.entity';

export interface ISubscriptionRepository {
  /**
   * Save a new subscription to persistence
   */
  save(subscription: Subscription): Promise<Subscription>;

  /**
   * Update an existing subscription
   */
  update(subscription: Subscription): Promise<Subscription>;

  /**
   * Find a subscription by its ID
   */
  findById(id: string): Promise<Subscription | null>;

  /**
   * Find a subscription by club ID
   */
  findByClubId(clubId: string): Promise<Subscription | null>;

  /**
   * Find a subscription by Stripe subscription ID
   */
  findByStripeSubscriptionId(
    stripeSubscriptionId: string,
  ): Promise<Subscription | null>;

  /**
   * Find a subscription by Stripe customer ID
   */
  findByStripeCustomerId(
    stripeCustomerId: string,
  ): Promise<Subscription | null>;

  /**
   * Find all subscriptions with a specific plan
   */
  findByPlanId(planId: SubscriptionPlanId): Promise<Subscription[]>;

  /**
   * Find all active subscriptions
   */
  findAllActive(): Promise<Subscription[]>;

  /**
   * Find subscriptions that are about to expire (within X days)
   */
  findExpiringSubscriptions(
    daysUntilExpiration: number,
  ): Promise<Subscription[]>;

  /**
   * Find subscriptions that are canceled but still active
   */
  findCanceledButActive(): Promise<Subscription[]>;

  /**
   * Delete a subscription by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Count total subscriptions (useful for analytics)
   */
  count(): Promise<number>;

  /**
   * Count subscriptions by plan ID
   */
  countByPlanId(planId: SubscriptionPlanId): Promise<number>;
}

/**
 * Repository token for dependency injection
 */
export const SUBSCRIPTION_REPOSITORY = Symbol('SUBSCRIPTION_REPOSITORY');
