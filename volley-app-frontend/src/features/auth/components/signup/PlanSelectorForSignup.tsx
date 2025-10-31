/**
 * PlanSelectorForSignup Component (Atomic)
 *
 * Simplified plan selector for coach signup
 * Displays all available plans without requiring a clubId
 */

"use client";

import { useEffect } from "react";
import { PlanCard } from "../../../club-management/components/subscription/PlanCard";
import { useSubscription } from "../../../club-management/hooks";
import type { SubscriptionPlanId } from "../../../club-management/types";

export interface PlanSelectorForSignupProps {
  readonly selectedPlanId: SubscriptionPlanId | null;
  readonly onSelectPlan: (planId: SubscriptionPlanId) => void;
}

export function PlanSelectorForSignup({
  selectedPlanId,
  onSelectPlan,
}: PlanSelectorForSignupProps) {
  const { availablePlans, isLoading, error, fetchPlans } = useSubscription();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chargement des plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {availablePlans.map((plan) => (
        <button
          key={plan.id}
          onClick={() => onSelectPlan(plan.id)}
          className="w-full text-left"
        >
          <PlanCard
            plan={plan}
            isCurrentPlan={plan.id === selectedPlanId}
            isPopular={plan.id === "PRO"}
            onSelect={onSelectPlan}
          />
        </button>
      ))}
    </div>
  );
}
