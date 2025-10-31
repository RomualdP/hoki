/**
 * ClubDetailsSkeleton - Loading Skeleton
 *
 * Skeleton for club details during Suspense loading
 * Matches the visual structure of ClubDetailsServer
 */
export function ClubDetailsSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-64 mb-2" />
        <div className="h-4 bg-neutral-200 rounded w-96" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
          >
            <div className="animate-pulse space-y-4">
              <div className="h-5 bg-neutral-200 rounded w-48 mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-neutral-200 rounded w-32" />
                  <div className="h-4 bg-neutral-200 rounded w-40" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-neutral-200 rounded w-32" />
                  <div className="h-4 bg-neutral-200 rounded w-40" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
