'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TrainingTemplateForm } from '@/features/training-management/components/TrainingTemplateForm';
import {
  getTrainingTemplates,
  updateTrainingTemplate,
} from '@/features/training-management/api/training-template.api';
import type {
  TrainingTemplate,
  UpdateTrainingTemplateData,
} from '@/types/training-template.types';

export default function EditTrainingTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [template, setTemplate] = useState<TrainingTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplate();
  }, [id]);

  const loadTemplate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const templates = await getTrainingTemplates();
      const found = templates.find((t) => t.id === id);
      if (!found) {
        setError('Template non trouvé');
        setIsLoading(false);
        return;
      }
      setTemplate(found);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors du chargement',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateTrainingTemplateData) => {
    setIsSaving(true);
    try {
      await updateTrainingTemplate(id, data);
      router.push('/trainings/templates');
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/trainings/templates');
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {error || 'Template non trouvé'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Modifier le template d'entraînement
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Modifiez les détails du template d'entraînement
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <TrainingTemplateForm
          template={template}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}

