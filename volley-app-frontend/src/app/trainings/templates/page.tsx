import { Suspense } from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import {
  TemplatesListServer,
  TemplatesListSkeleton,
} from "@/features/training-management/components";

// Force dynamic rendering (uses cookies for auth)
export const dynamic = "force-dynamic";

/**
 * TrainingTemplatesPage - Server Component
 *
 * Page orchestration (max 50 lines)
 * - Header with create button
 * - Templates list with Suspense
 * - Protected: OWNER and COACH only
 */
export default async function TrainingTemplatesPage() {
  await requireRole(["OWNER", "COACH"]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-heading">
            Templates d&apos;entraînement
          </h1>
          <p className="mt-2 text-neutral-600">
            Gérez vos templates pour la création automatique des entraînements
          </p>
        </div>
        <Link href="/trainings/templates/new">
          <Button variant="primary" size="md">
            Créer un template
          </Button>
        </Link>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Automatisation:</strong> Les templates actifs créeront
          automatiquement des entraînements chaque lundi à 9h pour la semaine
          suivante.
        </p>
      </div>

      {/* Templates List with Suspense */}
      <Suspense fallback={<TemplatesListSkeleton />}>
        <TemplatesListServer />
      </Suspense>
    </div>
  );
}
