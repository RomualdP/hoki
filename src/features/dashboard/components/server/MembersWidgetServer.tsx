import Link from "next/link";
import { getClubUsers } from "@/features/users/api/users.server";
import { ROUTES } from "@/constants";
import { DashboardCard } from "../DashboardCard";

/**
 * MembersWidgetServer - Server Component
 *
 * Display club members list (read-only for assistant)
 * Server-side data fetching
 *
 * Pattern: Server Component with async data fetching
 */
export async function MembersWidgetServer() {
  const members = await getClubUsers();

  return (
    <DashboardCard
      title="Membres du Club"
      action={
        <Link
          href={ROUTES.PLAYERS}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Voir tout
        </Link>
      }
    >
      {members.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-neutral-500 text-sm">Aucun membre trouvé</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-700 mb-3">
            {members.length} membre{members.length > 1 ? "s" : ""}
          </p>
          <div className="space-y-2">
            {members.slice(0, 5).map((member) => (
              <Link
                key={member.id}
                href={`${ROUTES.PLAYERS}/${member.id}`}
                className="block p-3 rounded-lg border border-neutral-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-neutral-600">{member.email}</p>
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
          </div>
          {members.length > 5 && (
            <p className="text-center text-xs text-neutral-500 pt-2">
              +{members.length - 5} autre{members.length - 5 > 1 ? "s" : ""}{" "}
              membre
              {members.length - 5 > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </DashboardCard>
  );
}
