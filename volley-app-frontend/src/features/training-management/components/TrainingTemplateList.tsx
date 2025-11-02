'use client';

import { useState } from 'react';
import type { TrainingTemplate } from '@/types/training-template.types';
import { DAYS_OF_WEEK } from '@/types/training-template.types';

interface TrainingTemplateListProps {
  templates: TrainingTemplate[];
  onToggle: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function TrainingTemplateList({
  templates,
  onToggle,
  onEdit,
  onDelete,
  isLoading = false,
}: TrainingTemplateListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      await onToggle(id);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      return;
    }

    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const getDayLabel = (dayOfWeek: number): string => {
    return DAYS_OF_WEEK.find((day) => day.value === dayOfWeek)?.label ?? '';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="h-4 w-1/3 rounded bg-gray-200"></div>
            <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">Aucun template d'entraînement créé</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <div
          key={template.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {template.title}
                </h3>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    template.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {template.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>

              {template.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {template.description}
                </p>
              )}

              <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Jour:</span>{' '}
                  {getDayLabel(template.dayOfWeek)} à {template.time}
                </div>
                <div>
                  <span className="font-medium">Durée:</span>{' '}
                  {template.duration} minutes
                </div>
                {template.location && (
                  <div>
                    <span className="font-medium">Lieu:</span>{' '}
                    {template.location}
                  </div>
                )}
                {template.maxParticipants && (
                  <div>
                    <span className="font-medium">Participants max:</span>{' '}
                    {template.maxParticipants}
                  </div>
                )}
              </div>
            </div>

            <div className="ml-4 flex space-x-2">
              <button
                onClick={() => handleToggle(template.id)}
                disabled={togglingId === template.id || deletingId === template.id}
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  template.isActive
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                } disabled:opacity-50`}
              >
                {togglingId === template.id
                  ? '...'
                  : template.isActive
                    ? 'Désactiver'
                    : 'Activer'}
              </button>

              <button
                onClick={() => onEdit(template.id)}
                disabled={deletingId === template.id || togglingId === template.id}
                className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 hover:bg-blue-200 disabled:opacity-50"
              >
                Éditer
              </button>

              <button
                onClick={() => handleDelete(template.id)}
                disabled={
                  deletingId === template.id || togglingId === template.id
                }
                className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-800 hover:bg-red-200 disabled:opacity-50"
              >
                {deletingId === template.id ? '...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

