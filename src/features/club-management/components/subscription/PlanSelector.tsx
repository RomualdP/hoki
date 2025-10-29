/**
 * PlanSelector Component (Smart)
 *
 * Handles subscription plan selection and checkout
 * Mobile-first design with card grid
 */

"use client";

import { useEffect } from "react";
import { PlanCard } from "./PlanCard";
import { useSubscription } from "../../hooks";
import type { SubscriptionPlanId } from "../../types";

export interface PlanSelectorProps {
  readonly clubId: string;
  readonly currentPlanId?: SubscriptionPlanId;
  readonly onPlanSelected?: (planId: SubscriptionPlanId) => void;
  readonly mode?: "subscribe" | "upgrade";
}

export function PlanSelector({
  clubId,
  currentPlanId,
  onPlanSelected,
  mode = "subscribe",
}: PlanSelectorProps) {
  const {
    availablePlans,
    isLoading,
    error,
    fetchPlans,
    createCheckoutSession,
  } = useSubscription();

  // Fetch plans on mount
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  /**
   * Handle plan selection
   */
  const handleSelectPlan = async (planId: SubscriptionPlanId) => {
    try {
      // If free plan, just notify parent
      const selectedPlan = availablePlans.find((p) => p.id === planId);
      if (selectedPlan?.price === 0) {
        if (onPlanSelected) {
          onPlanSelected(planId);
        }
        return;
      }

      // For paid plans, create Stripe checkout session
      const { url } = await createCheckoutSession(clubId, planId);

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (err) {
        console.error("Failed to select plan:", err);
    }
  };

  // Loading state
  if (isLoading && availablePlans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Chargement des plans...</p>
      </div>
    );
  }

  // Error state
  if (error && availablePlans.length === 0) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === "subscribe"
            ? "Choisissez votre plan"
            : "Upgrade votre plan"}
        </h2>
        <p className="text-gray-600">
          Sélectionnez le plan adapté à vos besoins
        </p>
      </div>

      {/* Plans Grid - Mobile First */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availablePlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={currentPlanId === plan.id}
            isPopular={plan.id === "STARTER"}
            onSelect={handleSelectPlan}
            disabled={isLoading}
            selectButtonText={
              mode === "subscribe" ? "Choisir ce plan" : "Upgrade"
            }
          />
        ))}
      </div>

      {/* Info Message */}
      <div className="text-center text-sm text-gray-500">
        <p>Tous les paiements sont sécurisés par Stripe</p>
      </div>
    </div>
  );
}
