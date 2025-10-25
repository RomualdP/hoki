import { serverFetch } from "@/lib/server-fetch";
import type { Team } from "@/shared/types";

/**
 * Server-side API for Teams
 *
 * Functions to fetch team data from Server Components
 * Uses serverFetch with httpOnly cookies for auth
 */

interface TeamsResponse {
  success: boolean;
  data: Team[];
}

interface TeamResponse {
  success: boolean;
  data: Team;
}

/**
 * Get all teams for the authenticated user's club
 */
export async function getTeams(): Promise<Team[]> {
  const response = await serverFetch<TeamsResponse>("/teams", {
    cache: "no-store",
  });

  return response?.data || [];
}

/**
 * Get a single team by ID
 */
export async function getTeam(teamId: string): Promise<Team | null> {
  const response = await serverFetch<TeamResponse>(`/teams/${teamId}`, {
    cache: "no-store",
  });

  return response?.data || null;
}

/**
 * Get teams count (for stats)
 */
export async function getTeamsCount(): Promise<number> {
  const teams = await getTeams();
  return teams.length;
}
