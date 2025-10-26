import { Card, CardContent } from "@/components/ui";
import { getMatches } from "@/features/matches/api/matches.server";
import { MatchCard } from "../MatchCard";
import type { MatchStatus } from "@/shared/types";

/**
 * MatchesListServer - Server Component
 *
 * Fetch and filter matches server-side based on search params
 * No client-side JavaScript for data fetching
 *
 * Pattern: Server Component with async data fetching + filtering
 */
interface MatchesListServerProps {
  readonly searchQuery?: string;
  readonly statusFilter?: string;
}

export async function MatchesListServer({
  searchQuery = "",
  statusFilter = "",
}: MatchesListServerProps) {
  const matches = await getMatches();

  // Server-side filtering
  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      !searchQuery ||
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (match.location &&
        match.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatusFilter =
      !statusFilter || match.status === (statusFilter as MatchStatus);

    return matchesSearch && matchesStatusFilter;
  });

  if (filteredMatches.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">Aucun match trouvé avec ces critères.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {filteredMatches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
