import { getClubMembers, getMembersByRole } from "@/features/club-management/api/members.server";

/**
 * PlayersStatsGrid - Server Component
 *
 * Displays statistics cards for club members
 * Fetches member data server-side and calculates stats
 * Uses Members table as source of truth (not User.clubRole)
 */

export async function PlayersStatsGrid() {
  const clubMembers = await getClubMembers();
  const players = await getMembersByRole("PLAYER");
  const coaches = clubMembers.filter(
    (member) =>
      member.clubRole === "COACH" || member.clubRole === "ASSISTANT_COACH",
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Members */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg
              className="w-6 h-6 text-green-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-neutral-600">
              Total membres
            </p>
            <p className="text-2xl font-bold text-neutral-900">
              {clubMembers.length}
            </p>
          </div>
        </div>
      </div>

      {/* Players */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm14 10.5V9c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v7h2v6h4v-6h2v-1.5zm-8 0V9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v7h2v6h4v-6h2v-1.5z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-neutral-600">Joueurs</p>
            <p className="text-2xl font-bold text-neutral-900">
              {players.length}
            </p>
          </div>
        </div>
      </div>

      {/* Staff */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 rounded-lg">
            <svg
              className="w-6 h-6 text-orange-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-neutral-600">Staff</p>
            <p className="text-2xl font-bold text-neutral-900">
              {coaches.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
