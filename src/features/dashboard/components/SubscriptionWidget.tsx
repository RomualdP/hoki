"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "../../../store";
import { useSubscription } from "../../club-management/hooks";
import { ROUTES } from "../../../constants";
import { DashboardCard } from "./DashboardCard";

/**
 * SubscriptionWidget - Smart Component
 *
 * Affiche le plan d'abonnement actuel et les limites
 * Bouton pour upgrader si pas au plan max
 *
 * Max 100 lignes (smart component)
 */
export function SubscriptionWidget() {
  const { clubId } = useAuthStore();
  const { currentSubscription, isLoading, fetchSubscription } =
    useSubscription();

  useEffect(() => {
    if (clubId) {
      void fetchSubscription(clubId);
    }
  }, [clubId, fetchSubscription]);

  if (isLoading) {
    return (
      <DashboardCard title="Mon Abonnement">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 rounded w-2/3 mb-2" />
          <div className="h-3 bg-neutral-200 rounded w-1/2" />
        </div>
      </DashboardCard>
    );
  }

  if (!currentSubscription) {
    return (
      <DashboardCard title="Mon Abonnement">
        <p className="text-neutral-500 text-sm">Aucun abonnement actif</p>
      </DashboardCard>
    );
  }

  const canUpgrade = currentSubscription.planId !== "PRO";

  return (
    <DashboardCard
      title="Mon Abonnement"
      action={
        canUpgrade && (
          <Link
            href={ROUTES.UPGRADE}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Upgrader
          </Link>
        )
      }
    >
      <div className="space-y-3">
        <div>
          <p className="text-lg font-semibold text-neutral-900">
            {currentSubscription.planName}
          </p>
          <p className="text-sm text-neutral-600">
            {currentSubscription.formattedPrice}
          </p>
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Équipes</span>
            <span className="font-medium text-neutral-900">
              {currentSubscription.currentTeamCount} /{" "}
              {currentSubscription.maxTeams || "∞"}
            </span>
          </div>

          {!currentSubscription.canCreateTeam && (
            <p className="text-xs text-orange-600">
              Limite atteinte. Upgradez pour créer plus d&apos;équipes.
            </p>
          )}
        </div>
      </div>
    </DashboardCard>
  );
}
