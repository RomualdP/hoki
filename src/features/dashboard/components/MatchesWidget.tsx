"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useMatchesApi } from "../../matches/hooks";
import { ROUTES } from "../../../constants";
import { DashboardCard } from "./DashboardCard";
import { formatDate } from "../../../utils";
import type { Match } from "../../../types";

/**
 * MatchesWidget - Smart Component
 *
 * Affiche les 3 prochains matchs programmés
 * Lien pour voir tous les matchs
 *
 * Max 100 lignes (smart component)
 */
export function MatchesWidget() {
  const { matches, isLoading, fetchMatches } = useMatchesApi();

  useEffect(() => {
    void fetchMatches();
  }, [fetchMatches]);

  const upcomingMatches = useMemo(() => {
    const now = new Date();
    return matches
      .filter(
        (match) =>
          match.status === "SCHEDULED" && new Date(match.scheduledAt) >= now,
      )
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      )
      .slice(0, 3);
  }, [matches]);

  if (isLoading) {
    return (
      <DashboardCard title="Prochains Matchs">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-3/4" />
          <div className="h-4 bg-neutral-200 rounded w-2/3" />
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Prochains Matchs"
      action={
        <Link
          href={ROUTES.MATCHES}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Voir tout
        </Link>
      }
    >
      {upcomingMatches.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-neutral-500 text-sm">Aucun match programmé</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingMatches.map((match) => (
            <MatchItem key={match.id} match={match} />
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

/**
 * MatchItem - Dumb Component
 *
 * Affiche un match individuel avec date, équipes, lieu
 * Max 80 lignes (dumb component)
 */
interface MatchItemProps {
  readonly match: Match;
}

function MatchItem({ match }: MatchItemProps) {
  return (
    <Link
      href={`${ROUTES.MATCHES}/${match.id}`}
      className="block p-3 rounded-lg border border-neutral-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <span>{formatDate(match.scheduledAt)}</span>
          {match.location && <span>📍 {match.location}</span>}
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="font-medium text-neutral-900 text-sm text-right flex-1">
            {match.homeTeam.name}
          </span>
          <span className="text-neutral-500 text-xs font-medium">vs</span>
          <span className="font-medium text-neutral-900 text-sm text-left flex-1">
            {match.awayTeam.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
