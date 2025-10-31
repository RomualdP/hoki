/**
 * PlayersListSkeleton - Loading Skeleton
 *
 * Displays loading state for players list
 * Matches the structure of PlayersSearch
 */
export function PlayersListSkeleton() {
  return (
    <>
      {/* Search Skeleton */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8 animate-pulse">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="h-4 bg-neutral-200 rounded w-24 mb-2" />
            <div className="h-10 bg-neutral-100 rounded" />
          </div>
          <div className="flex items-end">
            <div className="h-10 w-20 bg-neutral-200 rounded" />
          </div>
        </div>
      </div>

      {/* Players List Skeleton */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="px-6 py-4 border-b border-neutral-200 animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-48" />
        </div>
        <div className="divide-y divide-neutral-200">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-6 py-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-200" />
                  <div>
                    <div className="h-5 bg-neutral-200 rounded w-32 mb-2" />
                    <div className="h-4 bg-neutral-100 rounded w-48" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-16 bg-neutral-200 rounded-full" />
                  <div className="h-8 w-24 bg-neutral-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
