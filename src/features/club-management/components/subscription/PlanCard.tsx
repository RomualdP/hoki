/**
 * PlanCard Component (Dumb)
 *
 * Displays a subscription plan card
 * Pure presentation component
 */

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "../../../../components/ui";
import type { SubscriptionPlan, SubscriptionPlanId } from "../../types";
import { formatPrice } from "../../utils";

export interface PlanCardProps {
  readonly plan: SubscriptionPlan;
  readonly isCurrentPlan?: boolean;
  readonly isPopular?: boolean;
  readonly onSelect: (planId: SubscriptionPlanId) => void;
  readonly disabled?: boolean;
  readonly selectButtonText?: string;
}

export function PlanCard({
  plan,
  isCurrentPlan = false,
  isPopular = false,
  onSelect,
  disabled = false,
  selectButtonText = "Choisir",
}: PlanCardProps) {
  const maxTeamsText =
    plan.maxTeams === null
      ? "Illimité"
      : `${plan.maxTeams} équipe${plan.maxTeams > 1 ? "s" : ""}`;

  return (
    <Card
      className={`relative ${
        isCurrentPlan
          ? "border-2 border-blue-500"
          : isPopular
            ? "border-2 border-orange-500"
            : ""
      }`}
    >
      {/* Popular Badge */}
      {isPopular && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
            Populaire
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
            Plan actuel
          </span>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-center">
          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Price */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-900">
            {formatPrice(plan.price)}
            {plan.price > 0 && (
              <span className="text-lg font-normal text-gray-500">/mois</span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 text-center mb-6">
          {plan.description}
        </p>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {/* Max Teams */}
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-green-500 mr-2 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-gray-700">{maxTeamsText}</span>
          </div>

          {/* Other Features */}
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Select Button */}
        <Button
          variant={isCurrentPlan ? "outline" : "primary"}
          onClick={() => onSelect(plan.id)}
          disabled={disabled || isCurrentPlan}
          className="w-full"
        >
          {isCurrentPlan ? "Plan actuel" : selectButtonText}
        </Button>
      </CardContent>
    </Card>
  );
}
