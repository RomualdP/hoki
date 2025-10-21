/**
 * SubscriptionStatus Component (Dumb)
 *
 * Displays current subscription status with visual indicators
 * Pure presentation component - Mobile first
 */

import type { Subscription } from "../../types";

export interface SubscriptionStatusProps {
  readonly subscription: Subscription;
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const getStatusBadge = () => {
    if (subscription.isCanceled) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
          Annulé
        </span>
      );
    }

    if (subscription.status === "ACTIVE") {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          Actif
        </span>
      );
    }

    return (
      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
        {subscription.status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Plan Name & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {subscription.planName}
          </h3>
          <p className="text-sm text-gray-500">{subscription.formattedPrice}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Teams Usage */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Équipes</span>
          <span className="font-medium text-gray-900">
            {subscription.currentTeamCount} /{" "}
            {subscription.maxTeams === null ? "∞" : subscription.maxTeams}
          </span>
        </div>

        {/* Progress Bar */}
        {subscription.maxTeams !== null && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                subscription.canCreateTeam ? "bg-blue-500" : "bg-red-500"
              }`}
              style={{
                width: `${(subscription.currentTeamCount / subscription.maxTeams) * 100}%`,
              }}
            />
          </div>
        )}

        {/* Limit Warning */}
        {!subscription.canCreateTeam && (
          <p className="text-sm text-red-600">
            Limite d&apos;équipes atteinte. Veuillez upgrader votre plan.
          </p>
        )}
      </div>

      {/* Period Info */}
      {subscription.currentPeriodEnd && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {subscription.cancelAtPeriodEnd
              ? `Se termine le ${new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR")}`
              : `Renouvellement le ${new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR")}`}
          </p>
          {subscription.remainingDays !== null && (
            <p className="text-xs text-gray-500 mt-1">
              {subscription.remainingDays} jour
              {subscription.remainingDays > 1 ? "s" : ""} restant
              {subscription.remainingDays > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
