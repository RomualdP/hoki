import Link from "next/link";
import { Button } from "@/shared/components";
import type { User } from "@/types";

/**
 * PlayerCard - Dumb Component
 *
 * Displays a single player card with role badge
 * Pure presentation, receives all data as props
 */

interface PlayerCardProps {
  readonly player: User;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="px-6 py-4 hover:bg-neutral-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-lg font-medium text-orange-800">
              {player.firstName.charAt(0)}
              {player.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-base font-medium text-neutral-900">
              {player.firstName} {player.lastName}
            </h3>
            <p className="text-sm text-neutral-500">{player.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={getRoleBadge(player.clubRole)}>
            {getRoleLabel(player.clubRole)}
          </span>
          <Link href={`/players/${player.id}`}>
            <Button variant="ghost" size="sm">
              Voir profil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Get role badge CSS classes
 */
function getRoleBadge(role?: string | null): string {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
  switch (role) {
    case "OWNER":
      return `${baseClasses} bg-orange-100 text-orange-800`;
    case "COACH":
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case "PLAYER":
      return `${baseClasses} bg-green-100 text-green-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
}

/**
 * Get role label in French
 */
function getRoleLabel(role?: string | null): string {
  switch (role) {
    case "OWNER":
      return "Propriétaire";
    case "COACH":
      return "Coach";
    case "PLAYER":
      return "Joueur";
    default:
      return "Membre";
  }
}
