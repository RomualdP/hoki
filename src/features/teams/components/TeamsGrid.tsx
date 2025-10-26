import { Button } from "@/shared/components";
import { TeamCard } from "./TeamCard";
import type { Team } from "@/shared/types";

/**
 * TeamsGrid - Dumb Component
 *
 * Display teams in a responsive grid with empty state
 * Props-based, no state, no effects
 *
 * Pattern: Dumb component (max 80 lines)
 */
interface TeamsGridProps {
  readonly teams: Team[];
}

export function TeamsGrid({ teams }: TeamsGridProps) {
  if (teams.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-neutral-500">Aucune équipe disponible</p>
        <Button className="mt-4">Créer la première équipe</Button>
      </div>
    );
  }

  return (
    <>
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </>
  );
}
