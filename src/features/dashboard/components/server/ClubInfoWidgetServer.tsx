import { getCurrentClub } from "@/features/club-management/api/club.server";
import { DashboardCard } from "../DashboardCard";

/**
 * ClubInfoWidgetServer - Server Component
 *
 * Fetch current club data server-side and display
 * No client-side JavaScript for data fetching
 *
 * Pattern: Server Component with async data fetching
 */
export async function ClubInfoWidgetServer() {
  const currentClub = await getCurrentClub();

  if (!currentClub) {
    return (
      <DashboardCard title="Mon Club">
        <p className="text-neutral-500 text-sm">Aucun club trouvé</p>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Mon Club">
      <div className="space-y-2">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            {currentClub.name}
          </h3>
          {currentClub.description && (
            <p className="text-sm text-neutral-600 mt-1">
              {currentClub.description}
            </p>
          )}
        </div>
      </div>
    </DashboardCard>
  );
}
