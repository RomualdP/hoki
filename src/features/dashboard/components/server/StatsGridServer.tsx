import { IconUsersGroup } from "@tabler/icons-react";
import { getTeamsCount } from "@/features/teams/api/teams.server";
import { StatsWidget } from "../StatsWidget";

/**
 * StatsGridServer - Server Component
 *
 * Fetch stats data server-side and display in grid
 * No client-side JavaScript for data fetching
 *
 * Pattern: Server Component with async data fetching
 */
export async function StatsGridServer() {
  const teamsCount = await getTeamsCount();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <StatsWidget
        label="Total équipes"
        value={teamsCount}
        color="orange"
        icon={<IconUsersGroup className="w-6 h-6" />}
      />
    </div>
  );
}
