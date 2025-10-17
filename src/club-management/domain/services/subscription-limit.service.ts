/**
 * SubscriptionLimitService - Domain Service
 *
 * Domain service for subscription limit verification and management.
 * This service encapsulates business logic that doesn't naturally fit
 * within a single entity.
 *
 * Why a Domain Service?
 * - The logic involves multiple entities (Subscription + Team count)
 * - It's a core business rule that belongs in the domain layer
 * - It's not just CRUD operations (which would be in repositories)
 */

import { Subscription } from '../entities/subscription.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionLimitService {
  /**
   * Check if a club can create a new team based on its subscription
   *
   * @param subscription - The club's subscription
   * @param currentTeamCount - Current number of teams the club has
   * @returns true if the club can create a new team
   */
  canCreateTeam(subscription: Subscription, currentTeamCount: number): boolean {
    return subscription.canCreateTeam(currentTeamCount);
  }

  /**
   * Get remaining teams that can be created
   *
   * @param subscription - The club's subscription
   * @param currentTeamCount - Current number of teams the club has
   * @returns Number of remaining teams (null if unlimited)
   */
  getRemainingTeams(
    subscription: Subscription,
    currentTeamCount: number,
  ): number | null {
    return subscription.getRemainingTeams(currentTeamCount);
  }

  /**
   * Validate that a club can create N additional teams
   *
   * @param subscription - The club's subscription
   * @param currentTeamCount - Current number of teams
   * @param teamsToCreate - Number of teams to create
   * @throws Error if limit would be exceeded
   */
  validateCanCreateTeams(
    subscription: Subscription,
    currentTeamCount: number,
    teamsToCreate: number,
  ): void {
    if (teamsToCreate < 1) {
      throw new Error('Number of teams to create must be at least 1');
    }

    const remaining = subscription.getRemainingTeams(currentTeamCount);

    // If unlimited, always allow
    if (remaining === null) {
      return;
    }

    // Check if we have enough remaining slots
    if (teamsToCreate > remaining) {
      throw new Error(
        `Cannot create ${teamsToCreate} teams. Only ${remaining} team(s) remaining in your plan.`,
      );
    }
  }

  /**
   * Check if subscription is active and can be used
   *
   * @param subscription - The subscription to check
   * @throws Error if subscription is not active
   */
  validateSubscriptionActive(subscription: Subscription): void {
    if (!subscription.isActive()) {
      throw new Error(
        'Your subscription is not active. Please renew or upgrade your subscription.',
      );
    }
  }

  /**
   * Get upgrade recommendation based on current usage
   *
   * @param subscription - Current subscription
   * @param currentTeamCount - Current number of teams
   * @returns Recommendation message or null if no upgrade needed
   */
  getUpgradeRecommendation(
    subscription: Subscription,
    currentTeamCount: number,
  ): string | null {
    const remaining = subscription.getRemainingTeams(currentTeamCount);

    // No recommendation for unlimited plans
    if (remaining === null) {
      return null;
    }

    // Recommend upgrade if at limit
    if (remaining === 0) {
      return 'You have reached your team limit. Upgrade your plan to create more teams.';
    }

    // Recommend upgrade if close to limit (1 team remaining)
    if (remaining === 1) {
      return 'You are close to your team limit. Consider upgrading your plan.';
    }

    return null;
  }

  /**
   * Calculate usage percentage
   *
   * @param subscription - Current subscription
   * @param currentTeamCount - Current number of teams
   * @returns Usage percentage (0-100) or null if unlimited
   */
  calculateUsagePercentage(
    subscription: Subscription,
    currentTeamCount: number,
  ): number | null {
    if (subscription.maxTeams === null) {
      return null; // Unlimited
    }

    if (subscription.maxTeams === 0) {
      return 0;
    }

    const percentage = (currentTeamCount / subscription.maxTeams) * 100;
    return Math.min(100, Math.max(0, percentage));
  }
}
