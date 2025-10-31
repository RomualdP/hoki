import { getClubMembers } from "@/features/club-management/api/members.server";
import { PlayersSearch } from "./PlayersSearch";

/**
 * PlayersListServer - Server Component
 *
 * Fetches club members server-side and passes to client search component
 * Separates data fetching (server) from interactivity (client)
 * Uses Members table as source of truth (not User.clubRole)
 */

export async function PlayersListServer() {
  const players = await getClubMembers();

  return <PlayersSearch players={players} />;
}
