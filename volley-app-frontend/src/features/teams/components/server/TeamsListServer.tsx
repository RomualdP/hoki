import { getTeams } from "@/features/teams/api/teams.server";
import { TeamsStatsCards } from "../TeamsStatsCards";
import { TeamsGrid } from "../TeamsGrid";

/**
 * TeamsListServer - Server Component
 *
 * Fetch teams data server-side and display with stats + grid
 * No client-side JavaScript for data fetching
 *
 * Pattern: Server Component with async data fetching
 */
export async function TeamsListServer() {
  const teams = await getTeams();

  return (
    <>
      <TeamsStatsCards teams={teams} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TeamsGrid teams={teams} />
      </div>
    </>
  );
}
