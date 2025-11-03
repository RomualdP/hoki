import { serverFetch } from "@/lib/server-fetch";
import { REVALIDATE_SHORT } from "@/lib/cache-config";
import type {
  TrainingTemplate,
  TrainingTemplateListItem,
  TrainingTemplatesResponse,
} from "../types";

/**
 * Server-side API for Training Templates
 *
 * Functions to fetch training template data from Server Components
 * Uses serverFetch with httpOnly cookies for auth
 *
 * Cache Strategy: REVALIDATE_SHORT (1 minute)
 * - Template data can change frequently (activation/deactivation)
 * - Use short revalidation for better UX
 */

/**
 * Get all training templates for the current user's club
 * Backend automatically filters by club using JWT
 */
export async function getTrainingTemplates(params?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
}): Promise<TrainingTemplatesResponse | null> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.isActive !== undefined)
    searchParams.set("isActive", params.isActive.toString());

  const url = `/training-templates${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const response = await serverFetch<TrainingTemplatesResponse>(url, {
    next: { revalidate: REVALIDATE_SHORT },
  });

  return response || null;
}

/**
 * Get a single training template by ID
 */
export async function getTrainingTemplate(
  id: string,
): Promise<TrainingTemplate | null> {
  const response = await serverFetch<{
    success: boolean;
    data: TrainingTemplate;
  }>(`/training-templates/${id}`, {
    next: { revalidate: REVALIDATE_SHORT },
  });

  return response?.data || null;
}

/**
 * Get only active training templates
 */
export async function getActiveTrainingTemplates(): Promise<
  TrainingTemplateListItem[]
> {
  const response = await getTrainingTemplates({ isActive: true });
  return response?.data || [];
}
