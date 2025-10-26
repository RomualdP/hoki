import Link from "next/link";
import { getUser } from "@/lib/auth";
import { getTeams } from "@/features/teams/api/teams.server";
import { ROUTES } from "@/constants";
import { DashboardCard } from "../DashboardCard";

/**
 * MyTeamsWidgetServer - Server Component
 *
 * Display only teams where the current user is a member
 * Server-side filtering based on authenticated user
 *
 * Pattern: Server Component with async data fetching
 */
export async function MyTeamsWidgetServer() {
  const user = await getUser();
  const teams = await getTeams();

  const myTeams = user
    ? teams.filter((team) =>
        team.members.some((member) => member.user.id === user.id),
      )
    : [];

  return (
    <DashboardCard
      title="Mes Équipes"
      action={
        <Link
          href={ROUTES.TEAMS}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Voir tout
        </Link>
      }
    >
      {myTeams.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-neutral-500 text-sm mb-4">
            Vous n&apos;êtes membre d&apos;aucune équipe
          </p>
          <Link
            href={ROUTES.TEAMS}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
          >
            Voir les équipes
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {myTeams.slice(0, 3).map((team) => (
            <Link
              key={team.id}
              href={`${ROUTES.TEAMS}/${team.id}`}
              className="block p-3 rounded-lg border border-neutral-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">{team.name}</p>
                  <p className="text-xs text-neutral-600">
                    {team.members.length} membre
                    {team.members.length > 1 ? "s" : ""}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
          {myTeams.length > 3 && (
            <p className="text-center text-xs text-neutral-500 pt-2">
              +{myTeams.length - 3} autre
              {myTeams.length - 3 > 1 ? "s" : ""} équipe
              {myTeams.length - 3 > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </DashboardCard>
  );
}
