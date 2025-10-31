import { Suspense } from "react";
import { Button } from "@/shared/components";
import { TeamsListServer } from "@/features/teams/components/server/TeamsListServer";
import { TeamsListSkeleton } from "@/features/teams/components/TeamsListSkeleton";

/**
 * Teams Page - Server Component
 *
 * Display all teams with stats and grid
 * Server-side data fetching with Suspense streaming
 *
 * Pattern: Server Component + Suspense
 */
export default function TeamsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Équipes</h1>
          <p className="mt-2 text-neutral-600">
            Gérez et consultez toutes vos équipes de volleyball
          </p>
        </div>
        <Button>Créer une équipe</Button>
      </div>

      {/* Teams List with Stats */}
      <Suspense fallback={<TeamsListSkeleton />}>
        <TeamsListServer />
      </Suspense>
    </div>
  );
}
