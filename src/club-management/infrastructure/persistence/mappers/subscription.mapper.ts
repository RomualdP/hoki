import type {
  Subscription as PrismaSubscription,
  SubscriptionPlanId as PrismaSubscriptionPlanId,
  SubscriptionStatus as PrismaSubscriptionStatus,
} from '@prisma/client';
import { Subscription } from '../../../domain/entities/subscription.entity';
import {
  SubscriptionStatus,
  SubscriptionPlanId,
} from '../../../domain/entities/subscription.entity';
import { SubscriptionPlans } from '../../../domain/value-objects/subscription-plan.vo';
import { InvalidSubscriptionPlanException } from '../../../domain/exceptions';

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
      throw new InvalidSubscriptionPlanException(
        prismaSubscription.planId as string,
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
    planId: PrismaSubscriptionPlanId;
    status: PrismaSubscriptionStatus;
    price: number;
    maxTeams: number | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  } {
    return {
      id: subscription.id,
      clubId: subscription.clubId,
      planId: subscription.planId as PrismaSubscriptionPlanId,
      status: subscription.status as PrismaSubscriptionStatus,
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
    status: PrismaSubscriptionStatus;
    price: number;
    maxTeams: number | null;
    planId: PrismaSubscriptionPlanId;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
    updatedAt: Date;
  } {
    return {
      status: subscription.status as PrismaSubscriptionStatus,
      price: subscription.price,
      maxTeams: subscription.maxTeams,
      planId: subscription.planId as PrismaSubscriptionPlanId,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      updatedAt: new Date(),
    };
  }
}
