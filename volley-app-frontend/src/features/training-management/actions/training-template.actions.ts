"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/server-fetch";
import type {
  CreateTrainingTemplateInput,
  UpdateTrainingTemplateInput,
} from "../types";

interface ActionResult {
  success: boolean;
  error?: string;
  data?: { id: string };
}

/**
 * Create a new training template
 * Server Action for form submission
 */
export async function createTrainingTemplateAction(
  data: CreateTrainingTemplateInput,
): Promise<ActionResult> {
  try {
    const response = await serverFetch<{ id: string }>("/training-templates", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      requireAuth: false, // Allow errors to be thrown
    });

    if (!response) {
      return {
        success: false,
        error: "Erreur lors de la création du template",
      };
    }

    revalidatePath("/trainings/templates");
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la création du template",
    };
  }

  // redirect() throws NEXT_REDIRECT, must be outside try-catch
  redirect("/trainings/templates");
}

/**
 * Update an existing training template
 */
export async function updateTrainingTemplateAction(
  id: string,
  data: UpdateTrainingTemplateInput,
): Promise<ActionResult> {
  try {
    await serverFetch(`/training-templates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      requireAuth: false, // Allow errors to be thrown
    });

    revalidatePath("/trainings/templates");
    revalidatePath(`/trainings/templates/${id}`);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour du template",
    };
  }

  // redirect() throws NEXT_REDIRECT, must be outside try-catch
  redirect("/trainings/templates");
}

/**
 * Toggle template activation status
 */
export async function toggleTrainingTemplateAction(
  id: string,
): Promise<ActionResult> {
  try {
    await serverFetch(`/training-templates/${id}/toggle`, {
      method: "PATCH",
    });

    revalidatePath("/trainings/templates");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors du changement de statut",
    };
  }
}

/**
 * Delete a training template
 */
export async function deleteTrainingTemplateAction(
  id: string,
): Promise<ActionResult> {
  try {
    await serverFetch(`/training-templates/${id}`, {
      method: "DELETE",
    });

    revalidatePath("/trainings/templates");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression du template",
    };
  }
}
