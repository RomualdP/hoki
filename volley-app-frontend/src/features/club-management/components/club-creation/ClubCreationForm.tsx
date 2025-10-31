/**
 * ClubCreationForm Component (Smart)
 *
 * Handles club creation logic and state
 * Orchestrates the club creation flow
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ClubInfoStep } from "./ClubInfoStep";
import { Button } from "../../../../components/ui";
import { useClub } from "../../hooks";
import type { CreateClubDto } from "../../types";

export interface ClubCreationFormProps {
  readonly onSuccess?: (clubId: string) => void;
  readonly onCancel?: () => void;
}

interface FormData {
  name: string;
  description: string;
}

interface FormErrors {
  name?: string;
  description?: string;
}

export function ClubCreationForm({
  onSuccess,
  onCancel,
}: ClubCreationFormProps) {
  const router = useRouter();
  const { createClub, isLoading, error } = useClub();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * Validate form data
   */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom du club est requis";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const clubData: CreateClubDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };

      const result = await createClub(clubData);

      // Use View Transition for smooth navigation
      startTransition(() => {
        if (onSuccess) {
          onSuccess(result.id);
        } else {
          router.push("/dashboard/coach");
        }
      });
    } catch (err) {
      // Error is already handled by the hook
      console.error("Failed to create club:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Club Info Step */}
      <ClubInfoStep
        name={formData.name}
        description={formData.description}
        onNameChange={(value) => {
          setFormData((prev) => ({ ...prev, name: value }));
          if (errors.name) {
            setErrors((prev) => ({ ...prev, name: undefined }));
          }
        }}
        onDescriptionChange={(value) => {
          setFormData((prev) => ({ ...prev, description: value }));
          if (errors.description) {
            setErrors((prev) => ({ ...prev, description: undefined }));
          }
        }}
        errors={errors}
        disabled={isLoading || isPending}
      />

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || isPending}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || isPending}
          className="w-full sm:w-auto"
        >
          {isLoading || isPending ? "Création..." : "Créer le club"}
        </Button>
      </div>
    </form>
  );
}
