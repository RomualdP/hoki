import { Subscription } from '../../../domain/entities/subscription.entity';
import {
  SubscriptionStatus,
  SubscriptionPlanId,
} from '../../../domain/entities/subscription.entity';
import { SubscriptionPlans } from '../../../domain/value-objects/subscription-plan.vo';

/**
 * Mapper between Prisma Subscription model and Domain Subscription entity
 */
export class SubscriptionMapper {
  /**
   * Convert Prisma Subscription to Domain Subscription entity
   */
  static toDomain(prismaSubscription: any): Subscription {
    // Get plan configuration from catalog
    const planConfig = SubscriptionPlans.getById(
      prismaSubscription.planId as SubscriptionPlanId,
    );

    if (!planConfig) {
      throw new Error(
        `Invalid plan ID: ${prismaSubscription.planId} in subscription ${prismaSubscription.id}`,
      );
    }

    return Subscription.reconstitute({
      id: prismaSubscription.id,
      clubId: prismaSubscription.clubId,
      planId: prismaSubscription.planId as SubscriptionPlanId,
      status: prismaSubscription.status as SubscriptionStatus,
      price: prismaSubscription.price,
      maxTeams: prismaSubscription.maxTeams,
      stripeCustomerId: prismaSubscription.stripeCustomerId,
      stripeSubscriptionId: prismaSubscription.stripeSubscriptionId,
      currentPeriodStart: prismaSubscription.currentPeriodStart,
      currentPeriodEnd: prismaSubscription.currentPeriodEnd,
      cancelAtPeriodEnd: prismaSubscription.cancelAtPeriodEnd,
      createdAt: prismaSubscription.createdAt,
      updatedAt: prismaSubscription.updatedAt,
    });
  }

  /**
   * Convert Domain Subscription entity to Prisma data
   */
  static toPrisma(subscription: Subscription): any {
    return {
      id: subscription.id,
      clubId: subscription.clubId,
      planId: subscription.planId,
      status: subscription.status,
      price: subscription.price,
      maxTeams: subscription.maxTeams,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }

  /**
   * Convert Domain Subscription entity to Prisma create data
   */
  static toPrismaCreate(subscription: Subscription): any {
    return {
      id: subscription.id,
      clubId: subscription.clubId,
      planId: subscription.planId,
      status: subscription.status,
      price: subscription.price,
      maxTeams: subscription.maxTeams,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    };
  }

  /**
   * Convert Domain Subscription entity to Prisma update data
   */
  static toPrismaUpdate(subscription: Subscription): any {
    return {
      status: subscription.status,
      price: subscription.price,
      maxTeams: subscription.maxTeams,
      planId: subscription.planId,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      updatedAt: new Date(),
    };
  }
}
