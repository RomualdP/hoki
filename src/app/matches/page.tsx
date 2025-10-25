import { Suspense } from "react";
import { requireAuth } from "@/lib/auth";
import { Card, CardContent, Button } from "@/components/ui";
import { MatchFiltersClient } from "@/features/matches/components/MatchFiltersClient";
import { MatchesListServer } from "@/features/matches/components/server/MatchesListServer";
import { MatchesListSkeleton } from "@/features/matches/components/MatchesListSkeleton";

/**
 * Matches Page - Server Component
 *
 * Display matches list with filters (search + status)
 * Admin users can add new matches
 *
 * Pattern: Server Component + URL searchParams + Suspense
 */
interface MatchesPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    addForm?: string;
  }>;
}

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const user = await requireAuth();
  const params = await searchParams;

  const isAdmin = user.role === "ADMIN";
  const showAddForm = params.addForm === "true";
  const searchQuery = params.search || "";
  const statusFilter = params.status || "";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0 font-heading">
          Liste des Matchs
        </h1>
        {isAdmin && <Button variant="primary">Ajouter un match</Button>}
      </div>

      {/* Add Match Form for Admins */}
      {showAddForm && isAdmin && (
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Nouveau match</h2>
              <Button variant="outline">Annuler</Button>
            </div>
            <p className="text-gray-600 text-sm">
              Fonctionnalité d&apos;ajout de match à implémenter...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters (Client Component for interactivity) */}
      <MatchFiltersClient />

      {/* Matches List (Server Component with Suspense) */}
      <Suspense
        key={`${searchQuery}-${statusFilter}`}
        fallback={<MatchesListSkeleton />}
      >
        <MatchesListServer
          searchQuery={searchQuery}
          statusFilter={statusFilter}
        />
      </Suspense>
    </div>
  );
}
