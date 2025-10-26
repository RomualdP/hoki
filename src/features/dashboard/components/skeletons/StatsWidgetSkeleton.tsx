/**
 * StatsWidgetSkeleton - Skeleton for Stats Widgets
 *
 * Skeleton component for stat cards during Suspense loading
 */
export function StatsWidgetSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="animate-pulse flex items-center gap-4">
        {/* Icon skeleton */}
        <div className="w-12 h-12 bg-neutral-200 rounded-full" />

        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-neutral-200 rounded w-1/2" />
          <div className="h-6 bg-neutral-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}
