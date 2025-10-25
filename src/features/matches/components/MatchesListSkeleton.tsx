import { Card, CardContent } from "@/components/ui";

/**
 * MatchesListSkeleton - Loading Skeleton
 *
 * Skeleton for matches list during Suspense loading
 * Matches the visual structure of MatchesListServer
 */
export function MatchesListSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-6 w-32 bg-gray-200 rounded" />
                <div className="h-8 w-16 bg-gray-200 rounded" />
                <div className="h-6 w-32 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
