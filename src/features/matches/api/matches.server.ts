import { serverFetch } from "@/lib/server-fetch";
import type { Match } from "@/shared/types";

/**
 * Server-side API for Matches
 *
 * Functions to fetch match data from Server Components
 * Uses serverFetch with httpOnly cookies for auth
 */

interface MatchesResponse {
  success: boolean;
  data: Match[];
}

interface MatchResponse {
  success: boolean;
  data: Match;
}

/**
 * Get all matches
 */
export async function getMatches(): Promise<Match[]> {
  const response = await serverFetch<MatchesResponse>("/matches", {
    cache: "no-store",
  });

  return response?.data || [];
}

/**
 * Get upcoming matches (scheduled, future)
 */
export async function getUpcomingMatches(limit = 3): Promise<Match[]> {
  const matches = await getMatches();
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
    .slice(0, limit);
}

/**
 * Get match by ID
 */
export async function getMatch(matchId: string): Promise<Match | null> {
  const response = await serverFetch<MatchResponse>(`/matches/${matchId}`, {
    cache: "no-store",
  });

  return response?.data || null;
}
