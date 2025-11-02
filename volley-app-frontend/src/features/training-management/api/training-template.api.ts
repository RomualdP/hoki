import { get, post, patch, del } from '../../club-management/api/api-client';
import type {
  TrainingTemplate,
  CreateTrainingTemplateData,
  UpdateTrainingTemplateData,
} from '@/types/training-template.types';

/**
 * Get all training templates for the current user's club
 */
export async function getTrainingTemplates(): Promise<TrainingTemplate[]> {
  return get<TrainingTemplate[]>('/training-templates');
}

/**
 * Create a new training template
 */
export async function createTrainingTemplate(
  data: CreateTrainingTemplateData,
): Promise<{ id: string }> {
  return post<{ id: string }>('/training-templates', data);
}

/**
 * Update a training template
 */
export async function updateTrainingTemplate(
  id: string,
  data: UpdateTrainingTemplateData,
): Promise<void> {
  return patch<void>(`/training-templates/${id}`, data);
}

/**
 * Toggle training template active status
 */
export async function toggleTrainingTemplate(
  id: string,
): Promise<void> {
  return patch<void>(`/training-templates/${id}/toggle`, {});
}

/**
 * Delete a training template
 */
export async function deleteTrainingTemplate(id: string): Promise<void> {
  return del<void>(`/training-templates/${id}`);
}

