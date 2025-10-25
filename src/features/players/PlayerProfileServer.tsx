import { getUser, getUserLevel } from "@/features/users/api/users.server";
import { PlayerProfileCard } from "./PlayerProfileCard";

/**
 * PlayerProfileServer - Server Component
 *
 * Fetches user, profile, and level data server-side
 * Passes to client component for display and editing
 */

interface PlayerProfileServerProps {
  readonly userId: string;
}

export async function PlayerProfileServer({
  userId,
}: PlayerProfileServerProps) {
  const [user, level] = await Promise.all([
    getUser(userId),
    getUserLevel(userId),
  ]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Utilisateur non trouvé</p>
      </div>
    );
  }

  return <PlayerProfileCard user={user} level={level} />;
}
