/**
 * API Client - Inscription
 *
 * Gère les appels aux endpoints d'inscription backend
 */

import { API_BASE_URL } from "../../../constants";
import type {
  SignupCoachDto,
  SignupPlayerDto,
  SignupAssistantDto,
  SignupResponse,
  InvitationValidation,
} from "../types/signup.types";

/**
 * Standard API response format from NestJS backend
 */
interface ApiResponse<T> {
  data: T;
  success: boolean;
}

/**
 * Extract data from standard API response format
 */
function extractData<T>(responseData: unknown): T {
  // Check if response follows the standard { data, success } format
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData &&
    "success" in responseData
  ) {
    const apiResponse = responseData as ApiResponse<T>;
    return apiResponse.data;
  }

  // Fallback for responses that don't follow the standard format
  return responseData as T;
}

/**
 * Inscription Coach
 * POST /auth/signup/coach
 */
export async function signupCoach(
  data: SignupCoachDto,
): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signup/coach`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Erreur lors de l'inscription",
    }));
    throw new Error(error.message || "Erreur lors de l'inscription");
  }

  const responseData = await response.json();
  return extractData<SignupResponse>(responseData);
}

/**
 * Inscription Player
 * POST /auth/signup/player
 */
export async function signupPlayer(
  data: SignupPlayerDto,
): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signup/player`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Erreur lors de l'inscription",
    }));
    throw new Error(error.message || "Erreur lors de l'inscription");
  }

  const responseData = await response.json();
  return extractData<SignupResponse>(responseData);
}

/**
 * Inscription Assistant Coach
 * POST /auth/signup/assistant
 */
export async function signupAssistant(
  data: SignupAssistantDto,
): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signup/assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Erreur lors de l'inscription",
    }));
    throw new Error(error.message || "Erreur lors de l'inscription");
  }

  const responseData = await response.json();
  return extractData<SignupResponse>(responseData);
}

/**
 * Valider un token d'invitation
 * GET /invitations/validate?token=xxx
 */
export async function validateInvitationToken(
  token: string,
): Promise<InvitationValidation> {
  const response = await fetch(
    `${API_BASE_URL}/invitations/validate?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    return {
      isValid: false,
      error: "Token d'invitation invalide ou expiré",
    };
  }

  const responseData = await response.json();
  const data = extractData<{
    clubName: string;
    clubId: string;
    type: "PLAYER" | "ASSISTANT_COACH";
    expiresAt?: string;
  }>(responseData);

  return {
    isValid: true,
    clubName: data.clubName,
    clubId: data.clubId,
    invitationType: data.type,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
  };
}
