/**
 * Subscriptions API Client
 *
 * API client for subscription-related endpoints
 */

import { get, post } from "./api-client";
import type {
  Subscription,
  SubscriptionPlan,
  SubscribeToPlanDto,
  UpgradeSubscriptionDto,
} from "../types";

/**
 * Get subscription for a club
 */
export async function getSubscription(clubId: string): Promise<Subscription> {
  return get<Subscription>(`/subscriptions/club/${clubId}`);
}

/**
 * List all available subscription plans
 */
export async function listSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  console.log("[listSubscriptionPlans] Starting request...");
  const result = await get<SubscriptionPlan[]>("/subscriptions/plans");
  console.log("[listSubscriptionPlans] Result received:", result);
  console.log("[listSubscriptionPlans] Is array?", Array.isArray(result));
  console.log("[listSubscriptionPlans] Type:", typeof result);
  return result;
}

/**
 * Subscribe to a plan
 */
export async function subscribeToPlan(
  data: SubscribeToPlanDto,
): Promise<{ id: string }> {
  return post<{ id: string }>("/subscriptions/subscribe", data);
}

/**
 * Upgrade subscription to a higher plan
 */
export async function upgradeSubscription(
  data: UpgradeSubscriptionDto,
): Promise<{ id: string }> {
  return post<{ id: string }>("/subscriptions/upgrade", data);
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(clubId: string): Promise<void> {
  return post<void>(`/subscriptions/cancel/${clubId}`);
}

/**
 * Create Stripe checkout session for subscription payment
 */
export async function createCheckoutSession(
  clubId: string,
  planId: string,
): Promise<{ url: string }> {
  return post<{ url: string }>("/payments/create-checkout-session", {
    clubId,
    planId,
  });
}

/**
 * Create Stripe customer portal session for managing subscription
 */
export async function createPortalSession(
  clubId: string,
): Promise<{ url: string }> {
  return post<{ url: string }>("/payments/create-portal-session", {
    clubId,
  });
}
