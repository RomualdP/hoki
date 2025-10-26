/**
 * PlayersStatsGridSkeleton - Loading Skeleton
 *
 * Displays loading state for stats grid
 * Matches the structure of PlayersStatsGrid
 */
export function PlayersStatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-neutral-200 p-6 animate-pulse"
        >
          <div className="flex items-center">
            <div className="p-2 bg-neutral-100 rounded-lg w-10 h-10" />
            <div className="ml-4 flex-1">
              <div className="h-4 bg-neutral-200 rounded w-24 mb-2" />
              <div className="h-8 bg-neutral-200 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
