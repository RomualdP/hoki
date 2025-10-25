import { getClubUsers } from "@/features/users/api/users.server";
import { PlayersSearch } from "./PlayersSearch";

/**
 * PlayersListServer - Server Component
 *
 * Fetches club users server-side and passes to client search component
 * Separates data fetching (server) from interactivity (client)
 */
export async function PlayersListServer() {
  const players = await getClubUsers();
  console.log(players);
  return <PlayersSearch players={players} />;
}
