import Link from "next/link";
import { Card, CardContent, Button } from "@/components/ui";
import { formatDate } from "@/utils";
import { getStatusColor, getStatusLabel } from "../utils/match-status";
import type { Match } from "@/shared/types";

/**
 * MatchCard - Dumb Component
 *
 * Display a single match card with team info, score, and status
 * Props-based, no state, no effects
 *
 * Pattern: Dumb component (max 80 lines)
 */
interface MatchCardProps {
  readonly match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}
              >
                {getStatusLabel(match.status)}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(match.scheduledAt)}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="text-right">
                <h3 className="font-medium text-gray-900">
                  {match.homeTeam.name}
                </h3>
              </div>

              <div className="text-center">
                {match.status === "COMPLETED" &&
                match.homeScore !== undefined &&
                match.awayScore !== undefined ? (
                  <span className="text-2xl font-bold text-gray-900">
                    {match.homeScore} - {match.awayScore}
                  </span>
                ) : (
                  <span className="text-lg font-medium text-gray-500">vs</span>
                )}
              </div>

              <div className="text-left">
                <h3 className="font-medium text-gray-900">
                  {match.awayTeam.name}
                </h3>
              </div>
            </div>

            {match.location && (
              <p className="text-sm text-gray-600 text-center">
                📍 {match.location}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/matches/${match.id}`}>
              <Button variant="outline" size="sm">
                Détails
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
