/**
 * TeamsListSkeleton - Loading Skeleton
 *
 * Skeleton for teams list during Suspense loading
 * Matches the visual structure of TeamsListServer
 */
export function TeamsListSkeleton() {
  return (
    <>
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-neutral-200 p-6"
          >
            <div className="animate-pulse flex items-center">
              <div className="w-10 h-10 bg-neutral-200 rounded-lg" />
              <div className="ml-4 flex-1">
                <div className="h-3 bg-neutral-200 rounded w-24 mb-2" />
                <div className="h-6 bg-neutral-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Teams Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-neutral-200 p-6"
          >
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-5 bg-neutral-200 rounded w-32 mb-2" />
                  <div className="h-3 bg-neutral-200 rounded w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded" />
                <div className="h-4 bg-neutral-200 rounded w-5/6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
