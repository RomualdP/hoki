import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

/**
 * PlayerProfileSkeleton - Loading Skeleton
 *
 * Displays loading state for player profile
 */
export function PlayerProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6 animate-pulse">
          <div className="h-24 w-24 rounded-full bg-neutral-200 mx-auto mb-4" />
          <div className="h-6 bg-neutral-200 rounded w-32 mx-auto mb-2" />
          <div className="h-6 bg-neutral-200 rounded w-20 mx-auto mb-2" />
          <div className="h-4 bg-neutral-100 rounded w-40 mx-auto" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-16" />
            <div className="h-4 bg-neutral-200 rounded w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
