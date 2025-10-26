import Link from "next/link";
import { getUpcomingMatches } from "@/features/matches/api/matches.server";
import { ROUTES } from "@/constants";
import { DashboardCard } from "../DashboardCard";
import { formatDate } from "@/utils";
import type { Match } from "@/shared/types";

/**
 * MatchesWidgetServer - Server Component
 *
 * Fetch upcoming matches server-side and display
 * No client-side JavaScript for data fetching
 *
 * Pattern: Server Component with async data fetching
 */
export async function MatchesWidgetServer() {
  const upcomingMatches = await getUpcomingMatches(3);

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
 * Display a single match item
 * Pure presentation component
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
