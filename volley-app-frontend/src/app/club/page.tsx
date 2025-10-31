import { Suspense } from "react";
import { ClubDetailsServer } from "@/features/club-management/components/server/ClubDetailsServer";
import { ClubDetailsSkeleton } from "@/features/club-management/components/ClubDetailsSkeleton";

/**
 * Club Page - Server Component
 *
 * Detailed club page with all information
 * Accessible to all club members (OWNER, COACH, PLAYER)
 *
 * Pattern: Server Component + Suspense
 */
export default function ClubPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<ClubDetailsSkeleton />}>
          <ClubDetailsServer />
        </Suspense>
      </div>
    </div>
  );
}
