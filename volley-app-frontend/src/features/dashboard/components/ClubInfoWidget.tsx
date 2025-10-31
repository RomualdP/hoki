"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../../store";
import { useClub } from "../../club-management/hooks";
import { DashboardCard } from "./DashboardCard";

/**
 * ClubInfoWidget - Smart Component
 *
 * Affiche les informations du club de l'utilisateur
 * Fetch automatique du club au chargement
 *
 * Max 100 lignes (smart component)
 */
export function ClubInfoWidget() {
  const { clubId } = useAuthStore();
  const { currentClub, isLoading, fetchClub } = useClub();

  useEffect(() => {
    if (clubId) {
      void fetchClub(clubId);
    }
  }, [clubId, fetchClub]);

  if (isLoading) {
    return (
      <DashboardCard title="Mon Club">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-neutral-200 rounded w-1/2" />
        </div>
      </DashboardCard>
    );
  }

  if (!currentClub) {
    return (
      <DashboardCard title="Mon Club">
        <p className="text-neutral-500 text-sm">Aucun club trouvé</p>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Mon Club">
      <div className="space-y-2">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            {currentClub.name}
          </h3>
          {currentClub.description && (
            <p className="text-sm text-neutral-600 mt-1">
              {currentClub.description}
            </p>
          )}
        </div>
      </div>
    </DashboardCard>
  );
}
