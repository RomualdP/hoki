"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreateTrainingTemplateInput,
  UpdateTrainingTemplateInput,
  DAYS_OF_WEEK,
  TrainingTemplate,
} from "../types";
import {
  createTrainingTemplateAction,
  updateTrainingTemplateAction,
} from "../actions";

interface TemplateFormProps {
  template?: TrainingTemplate;
  mode: "create" | "edit";
}

/**
 * TemplateForm - Smart Component (Client)
 *
 * Form for creating/editing training templates
 * Max 100 lines (Smart Component rule)
 */
export function TemplateForm({ template, mode }: TemplateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: template?.title ?? "",
    description: template?.description ?? "",
    duration: template?.duration ?? 120,
    location: template?.location ?? "",
    maxParticipants: template?.maxParticipants ?? undefined,
    dayOfWeek: template?.dayOfWeek ?? 0,
    time: template?.time ?? "18:00",
    isActive: template?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Clean data: convert empty strings to undefined, remove undefined values
      const cleanedData = {
        title: formData.title,
        description: formData.description || undefined,
        duration: formData.duration,
        location: formData.location || undefined,
        maxParticipants: formData.maxParticipants || undefined,
        dayOfWeek: formData.dayOfWeek,
        time: formData.time,
        isActive: formData.isActive,
      };

      const result =
        mode === "create"
          ? await createTrainingTemplateAction(
              cleanedData as CreateTrainingTemplateInput,
            )
          : await updateTrainingTemplateAction(
              template!.id,
              cleanedData as UpdateTrainingTemplateInput,
            );

      if (result && !result.success) {
        setError(result.error ?? "Une erreur est survenue");
        setIsSubmitting(false);
      }
    } catch {
      setError("Une erreur est survenue");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded shadow-sm">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium text-sm">Erreur</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Titre *
        </label>
        <input
          type="text"
          required
          minLength={3}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Jour de la semaine *
          </label>
          <select
            required
            value={formData.dayOfWeek}
            onChange={(e) =>
              setFormData({ ...formData, dayOfWeek: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-neutral-300 rounded-md"
          >
            {DAYS_OF_WEEK.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Heure *
          </label>
          <input
            type="time"
            required
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Durée (minutes) *
          </label>
          <input
            type="number"
            required
            min={30}
            max={300}
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-neutral-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Participants max
          </label>
          <input
            type="number"
            min={1}
            value={formData.maxParticipants ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxParticipants: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className="w-full px-3 py-2 border border-neutral-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Lieu
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="w-full px-3 py-2 border border-neutral-300 rounded-md"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.checked })
          }
          className="h-4 w-4 text-primary-600 rounded"
        />
        <label htmlFor="isActive" className="ml-2 text-sm text-neutral-700">
          Template actif (créera automatiquement des entraînements)
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 transition font-medium"
        >
          {isSubmitting
            ? "Enregistrement..."
            : mode === "create"
              ? "Créer le template"
              : "Mettre à jour"}
        </button>
      </div>
    </form>
  );
}
