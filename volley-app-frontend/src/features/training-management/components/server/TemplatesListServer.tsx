import Link from "next/link";
import { getTrainingTemplates } from "../../api/training-templates.server";
import { TemplateCard } from "../TemplateCard";

/**
 * TemplatesListServer - Server Component
 *
 * Fetches and displays all training templates
 * Backend automatically filters by user's club
 */
export async function TemplatesListServer() {
  const response = await getTrainingTemplates();

  if (!response || response.data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 mb-4">
          Aucun template d&apos;entraînement créé
        </p>
        <Link
          href="/trainings/templates/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Créer mon premier template
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {response.data.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
