import { Suspense } from "react";
import { requireAuth } from "@/lib/auth";
import {
  ClubInfoWidgetServer,
  MyTeamsWidgetServer,
} from "@/features/dashboard/components/server";
import { DashboardWidgetSkeleton } from "@/features/dashboard/components/skeletons";

/**
 * Player Dashboard Page - Server Component
 *
 * Main dashboard for players after login
 * Shows 2 widgets: club info (read-only), my teams
 *
 * Pattern: Server Component + Suspense + Streaming
 * Mobile-first, responsive grid, max 50 lines (composition)
 *
 * Dynamic Rendering Strategy:
 * - Page: force-dynamic (due to requireAuth and user-specific data)
 * - Data: cached with revalidation (see *.server.ts files)
 * - Result: Page renders dynamically but data is served from cache
 */
export const dynamic = "force-dynamic";

export default async function PlayerDashboardPage() {
  const user = await requireAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Bienvenue, {user.firstName} 🏐
        </h1>
        <p className="mt-2 text-neutral-600">
          Consultez vos équipes et les informations de votre club
        </p>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<DashboardWidgetSkeleton />}>
          <ClubInfoWidgetServer />
        </Suspense>
        <Suspense fallback={<DashboardWidgetSkeleton />}>
          <MyTeamsWidgetServer />
        </Suspense>
      </div>
    </div>
  );
}
