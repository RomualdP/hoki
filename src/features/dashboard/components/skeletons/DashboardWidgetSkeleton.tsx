/**
 * DashboardWidgetSkeleton - Skeleton for Dashboard Widgets
 *
 * Generic skeleton component for dashboard widgets during Suspense loading
 * Matches the visual structure of DashboardCard
 */
export function DashboardWidgetSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="animate-pulse space-y-4">
        {/* Title skeleton */}
        <div className="h-5 bg-neutral-200 rounded w-1/3" />

        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-full" />
          <div className="h-4 bg-neutral-200 rounded w-5/6" />
          <div className="h-4 bg-neutral-200 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}
