'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useStoreHydration } from '@/hooks/useStoreHydration';
import {
  getTrainingTemplates,
  toggleTrainingTemplate,
  deleteTrainingTemplate,
} from '@/features/training-management/api/training-template.api';
import { TrainingTemplateList } from '@/features/training-management/components/TrainingTemplateList';
import type { TrainingTemplate } from '@/types/training-template.types';

export default function TrainingTemplatesPage() {
  const router = useRouter();
  const { isAuthenticated, clubRole } = useAuthStore();
  const hasHydrated = useStoreHydration();
  const [templates, setTemplates] = useState<TrainingTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Check if user has permission (OWNER or COACH)
  useEffect(() => {
    if (hasHydrated && isAuthenticated && clubRole !== 'OWNER' && clubRole !== 'COACH') {
      router.push('/coach'); // or appropriate dashboard
      return;
    }
  }, [hasHydrated, isAuthenticated, clubRole, router]);

  useEffect(() => {
    if (hasHydrated && isAuthenticated && (clubRole === 'OWNER' || clubRole === 'COACH')) {
      loadTemplates();
    }
  }, [hasHydrated, isAuthenticated, clubRole]);

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTrainingTemplates();
      setTemplates(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors du chargement',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTrainingTemplate(id);
      // Reload templates to get updated status
      await loadTemplates();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la modification',
      );
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/trainings/templates/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTrainingTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la suppression',
      );
    }
  };

  // Don't render until hydration and auth check are complete
  if (!hasHydrated || !isAuthenticated || (clubRole !== 'OWNER' && clubRole !== 'COACH')) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Templates d'entraînement
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Gérez les templates d'entraînement qui seront créés automatiquement chaque semaine
          </p>
        </div>
        <button
          onClick={() => router.push('/trainings/templates/new')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Nouveau template
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <TrainingTemplateList
        templates={templates}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}

