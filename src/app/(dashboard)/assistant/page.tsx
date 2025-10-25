import { Suspense } from "react";
import { requireAuth } from "@/lib/auth";
import {
  ClubInfoWidgetServer,
  TeamsWidgetServer,
  MembersWidgetServer,
} from "@/features/dashboard/components/server";
import { DashboardWidgetSkeleton } from "@/features/dashboard/components/skeletons";

/**
 * Assistant Dashboard Page - Server Component
 *
 * Main dashboard for assistant coaches after login
 * Shows 3 widgets: club info (read-only), teams (read-only), members
 *
 * Pattern: Server Component + Suspense + Streaming
 * Mobile-first, responsive grid, max 50 lines (composition)
 */
export default async function AssistantDashboardPage() {
  const user = await requireAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Bienvenue, {user.firstName} 🏐
        </h1>
        <p className="mt-2 text-neutral-600">
          Consultez les équipes et membres de votre club
        </p>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<DashboardWidgetSkeleton />}>
          <ClubInfoWidgetServer />
        </Suspense>
        <Suspense fallback={<DashboardWidgetSkeleton />}>
          <TeamsWidgetServer />
        </Suspense>
        <div className="lg:col-span-2">
          <Suspense fallback={<DashboardWidgetSkeleton />}>
            <MembersWidgetServer />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
