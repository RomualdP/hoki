import { Suspense } from "react";
import { Button } from "@/shared/components";
import { PlayersStatsGrid, PlayersStatsGridSkeleton, PlayersListServer, PlayersListSkeleton } from "@/features/players";

/**
 * PlayersPage - Server Component
 *
 * REFACTORED: From Client Component (282 lines) to Server Component (50 lines)
 *
 * Changes:
 * - ✅ Removed "use client" - Now a Server Component
 * - ✅ Removed useEffect data fetching - Server-side fetch with async/await
 * - ✅ Removed useAuthStore - Backend auto-filters by clubId
 * - ✅ Added Suspense boundaries for progressive rendering
 * - ✅ Decomposed into atomic components (stats, search, list, card)
 * - ✅ Eliminated client-side filtering overhead - Moved to dedicated Client Component
 * - ✅ Removed code duplication (getRoleBadge, getRoleLabel extracted)
 *
 * Architecture:
 * - Page (Server) → orchestrates layout
 * - PlayersStatsGrid (Server) → fetches and displays stats
 * - PlayersListServer (Server) → fetches users
 * - PlayersSearch (Client) → handles search interactivity
 * - PlayerCard (Dumb) → displays single player
 */
export default async function PlayersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-heading">
            Mes joueurs
          </h1>
          <p className="mt-2 text-neutral-600">
            Gérez et consultez tous les membres de votre club
          </p>
        </div>
        <Button>Inviter un joueur</Button>
      </div>

      {/* Stats with Suspense */}
      <Suspense fallback={<PlayersStatsGridSkeleton />}>
        <PlayersStatsGrid />
      </Suspense>

      {/* Players List with Suspense */}
      <Suspense fallback={<PlayersListSkeleton />}>
        <PlayersListServer />
      </Suspense>
    </div>
  );
}
