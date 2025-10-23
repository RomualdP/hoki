"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTeamsApi } from "../../teams/hooks";
import { ROUTES } from "../../../constants";
import { DashboardCard } from "./DashboardCard";

/**
 * TeamsWidget - Smart Component
 *
 * Affiche la liste des équipes du club
 * Bouton pour créer une nouvelle équipe (modal dans SPRINT 3)
 *
 * Max 100 lignes (smart component)
 */
export function TeamsWidget() {
  const { teams, isLoading, fetchTeams } = useTeamsApi();

  useEffect(() => {
    void fetchTeams();
  }, [fetchTeams]);

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
    <DashboardCard
      title="Mes Équipes"
      action={
        <Link
          href={ROUTES.TEAMS}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Voir tout
        </Link>
      }
    >
      {teams.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-neutral-500 text-sm mb-4">Aucune équipe créée</p>
          <Link
            href={ROUTES.TEAMS}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
          >
            Créer ma première équipe
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {teams.slice(0, 3).map((team) => (
            <Link
              key={team.id}
              href={`${ROUTES.TEAMS}/${team.id}`}
              className="block p-3 rounded-lg border border-neutral-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
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
          {teams.length > 3 && (
            <p className="text-center text-xs text-neutral-500 pt-2">
              +{teams.length - 3} autre{teams.length - 3 > 1 ? "s" : ""} équipe
              {teams.length - 3 > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </DashboardCard>
  );
}
