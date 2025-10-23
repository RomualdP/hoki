/**
 * useSubscription Hook
 *
 * Custom hook for subscription management operations
 */

import { useCallback } from "react";
import { useSubscriptionStore } from "../stores";
import * as subscriptionsApi from "../api/subscriptions.api";
import type {
  SubscribeToPlanDto,
  UpgradeSubscriptionDto,
  SubscriptionPlanId,
} from "../types";

export function useSubscription() {
  const {
    currentSubscription,
    availablePlans,
    isLoading,
    error,
    setCurrentSubscription,
    setAvailablePlans,
    setLoading,
    setError,
    clearError,
    reset,
  } = useSubscriptionStore();

  /**
   * Fetch subscription for a club
   */
  const fetchSubscription = useCallback(
    async (clubId: string) => {
      setLoading(true);
      clearError();

      try {
        const subscription = await subscriptionsApi.getSubscription(clubId);
        setCurrentSubscription(subscription);
        return subscription;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch subscription";
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setCurrentSubscription, setError],
  );

  /**
   * Fetch available subscription plans
   */
  const fetchPlans = useCallback(async () => {
    console.log("[useSubscription] fetchPlans called");
    setLoading(true);
    clearError();

    try {
      console.log("[useSubscription] Calling listSubscriptionPlans...");
      const plans = await subscriptionsApi.listSubscriptionPlans();
      console.log("[useSubscription] Plans received:", plans);
      console.log("[useSubscription] Is array?", Array.isArray(plans));
      console.log("[useSubscription] Calling setAvailablePlans with:", plans);
      setAvailablePlans(plans);
      return plans;
    } catch (error) {
      console.error("[useSubscription] Error fetching plans:", error);
      const message =
        error instanceof Error ? error.message : "Failed to fetch plans";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, setAvailablePlans, setError]);

  /**
   * Subscribe to a plan
   */
  const subscribe = useCallback(
    async (data: SubscribeToPlanDto) => {
      setLoading(true);
      clearError();

      try {
        const result = await subscriptionsApi.subscribeToPlan(data);
        // Refresh subscription after subscribing
        await fetchSubscription(data.clubId);
        return result;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to subscribe";
        setError(message);
        throw error;
      }
    },
    [setLoading, clearError, fetchSubscription, setError],
  );

  /**
   * Upgrade subscription to a higher plan
   */
  const upgrade = useCallback(
    async (data: UpgradeSubscriptionDto) => {
      setLoading(true);
      clearError();

      try {
        const result = await subscriptionsApi.upgradeSubscription(data);
        // Refresh subscription after upgrading
        await fetchSubscription(data.clubId);
        return result;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to upgrade subscription";
        setError(message);
        throw error;
      }
    },
    [setLoading, clearError, fetchSubscription, setError],
  );

  /**
   * Cancel subscription
   */
  const cancel = useCallback(
    async (clubId: string) => {
      setLoading(true);
      clearError();

      try {
        await subscriptionsApi.cancelSubscription(clubId);
        // Refresh subscription after canceling
        await fetchSubscription(clubId);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to cancel subscription";
        setError(message);
        throw error;
      }
    },
    [setLoading, clearError, fetchSubscription, setError],
  );

  /**
   * Create Stripe checkout session
   */
  const createCheckoutSession = useCallback(
    async (clubId: string, planId: SubscriptionPlanId) => {
      setLoading(true);
      clearError();

      try {
        const result = await subscriptionsApi.createCheckoutSession(
          clubId,
          planId,
        );
        return result;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create checkout session";
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError],
  );

  /**
   * Create Stripe customer portal session
   */
  const createPortalSession = useCallback(
    async (clubId: string) => {
      setLoading(true);
      clearError();

      try {
        const result = await subscriptionsApi.createPortalSession(clubId);
        return result;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create portal session";
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError],
  );

  /**
   * Check if can create team (based on subscription limits)
   */
  const canCreateTeam = useCallback(() => {
    if (!currentSubscription) return false;
    return currentSubscription.canCreateTeam;
  }, [currentSubscription]);

  return {
    // State
    currentSubscription,
    availablePlans,
    isLoading,
    error,

    // Actions
    fetchSubscription,
    fetchPlans,
    subscribe,
    upgrade,
    cancel,
    createCheckoutSession,
    createPortalSession,
    canCreateTeam,
    clearError,
    reset,
  };
}
