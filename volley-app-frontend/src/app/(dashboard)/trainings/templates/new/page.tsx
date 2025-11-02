'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrainingTemplateForm } from '@/features/training-management/components/TrainingTemplateForm';
import { createTrainingTemplate } from '@/features/training-management/api/training-template.api';
import type {
  CreateTrainingTemplateData,
} from '@/types/training-template.types';

export default function NewTrainingTemplatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateTrainingTemplateData) => {
    setIsLoading(true);
    try {
      const result = await createTrainingTemplate(data);
      if (result && result.id) {
        router.push('/trainings/templates');
      } else {
        throw new Error('Échec de la création du template');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/trainings/templates');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Créer un template d'entraînement
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Créez un template qui sera utilisé pour générer automatiquement des entraînements chaque semaine
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <TrainingTemplateForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

