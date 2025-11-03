"use client";

import Link from "next/link";
import { TrainingTemplateListItem, getDayLabel } from "../types";
import { deleteTrainingTemplateAction } from "../actions";
import { useState } from "react";

interface TemplateCardProps {
  template: TrainingTemplateListItem;
}

/**
 * TemplateCard - Dumb Component
 *
 * Displays a single training template card
 * Max 80 lines (Dumb Component rule)
 */
export function TemplateCard({ template }: TemplateCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce template ?")) return;
    setIsDeleting(true);
    await deleteTrainingTemplateAction(template.id);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900">
            {template.title}
          </h3>
          {template.description && (
            <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
              {template.description}
            </p>
          )}
        </div>
        <div className="ml-4">
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
              template.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {template.isActive ? "Actif" : "Inactif"}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-neutral-600 mb-4">
        <div className="flex items-center">
          <span className="font-medium w-24">Jour:</span>
          <span>{getDayLabel(template.dayOfWeek)}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium w-24">Heure:</span>
          <span>{template.time}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium w-24">Durée:</span>
          <span>{template.duration} min</span>
        </div>
        {template.location && (
          <div className="flex items-center">
            <span className="font-medium w-24">Lieu:</span>
            <span>{template.location}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 items-stretch">
        <Link
          href={`/trainings/templates/${template.id}`}
          className="flex-1 flex items-center justify-center px-4 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 transition"
        >
          Modifier
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
