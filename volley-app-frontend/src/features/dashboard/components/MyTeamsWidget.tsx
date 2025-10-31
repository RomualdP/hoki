"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuthStore } from "../../../store";
import { useTeamsApi } from "../../teams/hooks";
import { ROUTES } from "../../../constants";
import { DashboardCard } from "./DashboardCard";

/**
 * MyTeamsWidget - Smart Component
 *
 * Affiche uniquement les équipes dont le joueur est membre
 * Filtrage côté client basé sur user.id
 *
 * Max 100 lignes (smart component)
 */
export function MyTeamsWidget() {
  const { user } = useAuthStore();
  const { teams, isLoading, fetchTeams } = useTeamsApi();

  useEffect(() => {
    void fetchTeams();
  }, [fetchTeams]);

  const myTeams = useMemo(() => {
    if (!user) return [];
    return teams.filter((team) =>
      team.members.some((member) => member.user.id === user.id),
    );
  }, [teams, user]);

  if (isLoading) {
    return (
      <DashboardCard title="Mes Équipes">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-3/4" />
          <div className="h-4 bg-neutral-200 rounded w-2/3" />
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Mes Équipes">
      {myTeams.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-neutral-500 text-sm">
            Vous n&apos;êtes membre d&apos;aucune équipe pour le moment
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {myTeams.map((team) => (
            <Link
              key={team.id}
              href={`${ROUTES.TEAMS}/${team.id}`}
              className="block p-3 rounded-lg border border-neutral-200 hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">{team.name}</p>
                  <p className="text-xs text-neutral-600">
                    {team.members.length} membre
                    {team.members.length > 1 ? "s" : ""}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
