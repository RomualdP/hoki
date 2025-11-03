import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getTrainingTemplate } from "@/features/training-management/api/training-templates.server";
import { TemplateForm } from "@/features/training-management/components/TemplateForm";

// Force dynamic rendering (uses cookies for auth)
export const dynamic = "force-dynamic";

interface EditTemplatePageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * EditTemplatePage - Server Component
 *
 * Page for editing an existing training template
 * Max 50 lines (Page orchestration only)
 * Protected: OWNER and COACH only
 */
export default async function EditTemplatePage({
  params,
}: EditTemplatePageProps) {
  await requireRole(["OWNER", "COACH"]);

  const { id } = await params;
  const template = await getTrainingTemplate(id);

  if (!template) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 font-heading">
          Modifier le template
        </h1>
        <p className="mt-2 text-neutral-600">
          Modifiez les paramètres de votre template d&apos;entraînement
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <TemplateForm key={template.id} mode="edit" template={template} />
      </div>
    </div>
  );
}
