/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import type { Subscription as PrismaSubscription } from '@prisma/client';
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
  static toDomain(prismaSubscription: PrismaSubscription): Subscription {
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
  static toPrisma(subscription: Subscription): PrismaSubscription {
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
  static toPrismaCreate(subscription: Subscription): {
    id: string;
    clubId: string;
    planId: string;
    status: string;
    price: number;
    maxTeams: number;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  } {
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
  static toPrismaUpdate(subscription: Subscription): {
    status: string;
    price: number;
    maxTeams: number;
    planId: string;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    updatedAt: Date;
  } {
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
