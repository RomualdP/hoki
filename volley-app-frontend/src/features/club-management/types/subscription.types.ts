/**
 * Subscription Types
 *
 * Types for subscription plans and status
 */

/**
 * Subscription plan identifiers
 */
export type SubscriptionPlanId = "BETA" | "STARTER" | "PRO";

/**
 * Subscription status enum
 * Renamed from SubscriptionStatus to avoid conflict with SubscriptionStatus component
 */
export type SubscriptionStatusEnum =
  | "ACTIVE"
  | "CANCELED"
  | "EXPIRED"
  | "PENDING";

/**
 * Subscription plan - Matches SubscriptionPlanReadModel from backend
 */
export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  description: string;
  price: number;
  maxTeams: number | null; // null = unlimited
  features: string[];
  stripePriceId: string | null;
}

/**
 * Subscription status - Matches SubscriptionStatusReadModel from backend
 */
export interface Subscription {
  id: string;
  clubId: string;
  planId: SubscriptionPlanId;
  planName: string;
  status: SubscriptionStatusEnum;
  price: number;
  formattedPrice: string;
  maxTeams: number | null;
  currentTeamCount: number;
  canCreateTeam: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  isCanceled: boolean;
  remainingDays: number | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for subscribing to a plan
 */
export interface SubscribeToPlanDto {
  clubId: string;
  planId: SubscriptionPlanId;
}

/**
 * DTO for upgrading subscription
 */
export interface UpgradeSubscriptionDto {
  clubId: string;
  newPlanId: SubscriptionPlanId;
}
