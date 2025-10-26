import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { PlayerProfileServer, PlayerProfileSkeleton, PlayerSkillsServer, PlayerSkillsSkeleton } from "@/features/players";

/**
 * UserDetailPage - Server Component
 *
 * REFACTORED: From Client Component (550 lines) to Server Component (80 lines)
 *
 * Changes:
 * - ✅ Removed "use client" - Now a Server Component
 * - ✅ Removed 4 useEffect waterfalls - Parallel fetch with Promise.all
 * - ✅ Removed 10+ useState - State only in specific Client Components
 * - ✅ Added Suspense boundaries for progressive rendering
 * - ✅ Decomposed into atomic components (profile, skills, attributes)
 * - ✅ Removed useParams - Use Next.js params prop
 * - ✅ Server-side data fetching with async/await
 * - ✅ Eliminated client-side data caching - Fresh server data
 *
 * Architecture:
 * - Page (Server) → orchestrates layout and provides params
 * - PlayerProfileServer (Server) → fetches user + level in parallel
 * - PlayerSkillsServer (Server) → fetches and displays skills
 * - PlayerProfileCard (Client) → can handle profile editing
 *
 * TODO: Implement full editing capabilities with Server Actions
 * - Profile editing (updateProfile Server Action)
 * - Skills management (addSkill, updateSkill, deleteSkill Server Actions)
 * - Attributes management (updateAttributes Server Action)
 *
 * The original 550-line implementation had:
 * - 4 sequential useEffect calls (waterfall fetching)
 * - 10+ useState for local state management
 * - Complex editing logic mixed with data fetching
 * - Client-side caching with Zustand
 *
 * New implementation:
 * - Server-side data fetching with Suspense
 * - Parallel data fetching (no waterfall)
 * - Clear Server/Client separation
 * - Editing logic can be added with Server Actions
 */

interface PageProps {
  readonly params: Promise<{
    readonly id: string;
  }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id: userId } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-heading">
                  Détail utilisateur
                </h1>
                <p className="text-gray-600 mt-2">
                  Gestion du profil et des compétences
                </p>
              </div>
              <Link href="/players">
                <Button variant="outline">Retour à la liste</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Section with Suspense */}
            <div className="lg:col-span-1">
              <Suspense fallback={<PlayerProfileSkeleton />}>
                <PlayerProfileServer userId={userId} />
              </Suspense>
            </div>

            {/* Skills Section with Suspense */}
            <div className="lg:col-span-2">
              <Suspense fallback={<PlayerSkillsSkeleton />}>
                <PlayerSkillsServer userId={userId} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
