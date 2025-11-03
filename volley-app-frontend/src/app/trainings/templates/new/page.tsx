import { requireRole } from "@/lib/auth";
import { TemplateForm } from "@/features/training-management/components/TemplateForm";

// Force dynamic rendering (uses cookies for auth)
export const dynamic = "force-dynamic";

/**
 * NewTemplatePage - Server Component
 *
 * Page for creating a new training template
 * Max 50 lines (Page orchestration only)
 * Protected: OWNER and COACH only
 */
export default async function NewTemplatePage() {
  await requireRole(["OWNER", "COACH"]);
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 font-heading">
          Nouveau template d&apos;entraînement
        </h1>
        <p className="mt-2 text-neutral-600">
          Créez un template qui générera automatiquement des entraînements
          chaque semaine
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <TemplateForm mode="create" />
      </div>
    </div>
  );
}
