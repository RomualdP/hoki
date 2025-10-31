import { Suspense } from "react";
import { getUser } from "@/lib/auth";
import {
  StatsGridServer,
  ClubInfoWidgetServer,
  TeamsWidgetServer,
  MatchesWidgetServer,
  InvitationsWidgetServer,
} from "@/features/dashboard/components/server";
import {
  DashboardWidgetSkeleton,
  StatsWidgetSkeleton,
} from "@/features/dashboard/components/skeletons";

/**
 * Dashboard Coach Page - Server Component
 *
 * Page principale pour les coachs après connexion
 * Pattern: Server Component with Suspense streaming
 *
 * ✅ Server-first data fetching
 * ✅ Parallel data loading with Suspense
 * ✅ Progressive rendering
 * ✅ Zero client-side JavaScript for data fetching
 *
 * Dynamic Rendering Strategy:
 * - Page: force-dynamic (due to getUser and user-specific data)
 * - Data: cached with revalidation (see *.server.ts files)
 * - Result: Page renders dynamically but data is served from cache
 */
export const dynamic = "force-dynamic";

export default async function CoachDashboardPage() {
  // Fetch user server-side
  const user = await getUser();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Bienvenue, {user?.firstName} 🏐
        </h1>
        <p className="mt-2 text-neutral-600">
          Gérez votre club et vos équipes depuis votre dashboard
        </p>
      </div>

      {/* Stats Grid - Suspense for streaming */}
      <Suspense fallback={<StatsWidgetSkeleton />}>
        <StatsGridServer />
      </Suspense>

      {/* Widgets Grid - Each widget streams independently */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<DashboardWidgetSkeleton />}>
          <ClubInfoWidgetServer />
        </Suspense>

        <Suspense fallback={<DashboardWidgetSkeleton />}>
          <TeamsWidgetServer />
        </Suspense>

        <Suspense fallback={<DashboardWidgetSkeleton />}>
          <MatchesWidgetServer />
        </Suspense>

        <Suspense fallback={<DashboardWidgetSkeleton />}>
          <InvitationsWidgetServer />
        </Suspense>
      </div>
    </div>
  );
}
