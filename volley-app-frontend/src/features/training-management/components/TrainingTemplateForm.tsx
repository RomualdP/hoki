'use client';

import { useState, FormEvent } from 'react';
import type {
  TrainingTemplate,
  CreateTrainingTemplateData,
  UpdateTrainingTemplateData,
  DAYS_OF_WEEK,
} from '@/types/training-template.types';

interface TrainingTemplateFormProps {
  template?: TrainingTemplate;
  onSubmit: (
    data: CreateTrainingTemplateData | UpdateTrainingTemplateData,
  ) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function TrainingTemplateForm({
  template,
  onSubmit,
  onCancel,
  isLoading = false,
}: TrainingTemplateFormProps) {
  const [formData, setFormData] = useState({
    title: template?.title ?? '',
    description: template?.description ?? '',
    duration: template?.duration ?? 90,
    location: template?.location ?? '',
    maxParticipants: template?.maxParticipants ?? null,
    dayOfWeek: template?.dayOfWeek ?? 0,
    time: template?.time ?? '18:00',
    teamIds: template?.teamIds ?? [],
    isActive: template?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (formData.title.trim().length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    }

    if (formData.duration < 30 || formData.duration > 300) {
      newErrors.duration =
        'La durée doit être entre 30 et 300 minutes';
    }

    if (formData.maxParticipants !== null && formData.maxParticipants < 1) {
      newErrors.maxParticipants =
        'Le nombre maximum de participants doit être au moins 1';
    }

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(formData.time)) {
      newErrors.time = 'Le format de l\'heure doit être HH:mm';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const submitData: CreateTrainingTemplateData | UpdateTrainingTemplateData =
        {
          title: formData.title,
          description: formData.description || undefined,
          duration: formData.duration,
          location: formData.location || undefined,
          maxParticipants: formData.maxParticipants || undefined,
          dayOfWeek: formData.dayOfWeek,
          time: formData.time,
          teamIds: formData.teamIds.length > 0 ? formData.teamIds : undefined,
        };

      await onSubmit(submitData);
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : 'Une erreur est survenue lors de la soumission',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Titre *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700"
          >
            Durée (minutes) *
          </label>
          <input
            type="number"
            id="duration"
            min="30"
            max="300"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="maxParticipants"
            className="block text-sm font-medium text-gray-700"
          >
            Participants max (optionnel)
          </label>
          <input
            type="number"
            id="maxParticipants"
            min="1"
            value={formData.maxParticipants ?? ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxParticipants: e.target.value
                  ? Number(e.target.value)
                  : null,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.maxParticipants && (
            <p className="mt-1 text-sm text-red-600">
              {errors.maxParticipants}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Lieu
        </label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="dayOfWeek"
            className="block text-sm font-medium text-gray-700"
          >
            Jour de la semaine *
          </label>
          <select
            id="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={(e) =>
              setFormData({ ...formData, dayOfWeek: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            {[
              { value: 0, label: 'Lundi' },
              { value: 1, label: 'Mardi' },
              { value: 2, label: 'Mercredi' },
              { value: 3, label: 'Jeudi' },
              { value: 4, label: 'Vendredi' },
              { value: 5, label: 'Samedi' },
              { value: 6, label: 'Dimanche' },
            ].map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700"
          >
            Heure (HH:mm) *
          </label>
          <input
            type="time"
            id="time"
            value={formData.time}
            onChange={(e) =>
              setFormData({ ...formData, time: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          {errors.time && (
            <p className="mt-1 text-sm text-red-600">{errors.time}</p>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            disabled={isLoading}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading
            ? 'Enregistrement...'
            : template
              ? 'Mettre à jour'
              : 'Créer'}
        </button>
      </div>
    </form>
  );
}

