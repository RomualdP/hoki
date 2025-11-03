/**
 * TemplatesListSkeleton - Loading state
 */
export function TemplatesListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-9 bg-neutral-200 rounded"></div>
            <div className="flex-1 h-9 bg-neutral-200 rounded"></div>
            <div className="h-9 w-20 bg-neutral-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
