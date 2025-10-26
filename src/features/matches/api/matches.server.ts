import { serverFetch } from "@/lib/server-fetch";
import { REVALIDATE_MEDIUM } from "@/lib/cache-config";
import type { Match } from "@/shared/types";

/**
 * Server-side API for Matches
 *
 * Functions to fetch match data from Server Components
 * Uses serverFetch with httpOnly cookies for auth
 *
 * Cache Strategy: REVALIDATE_MEDIUM (5 minutes)
 * - Match data is cached for 5 minutes
 * - Pages remain dynamic (cookies() forces dynamic rendering)
 * - But data is served from cache during revalidation window
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
    next: { revalidate: REVALIDATE_MEDIUM },
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
    next: { revalidate: REVALIDATE_MEDIUM },
  });

  return response?.data || null;
}
