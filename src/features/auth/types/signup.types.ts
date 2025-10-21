/**
 * Types pour l'inscription
 *
 * DTOs correspondant aux endpoints backend :
 * - POST /auth/signup/coach
 * - POST /auth/signup/player
 * - POST /auth/signup/assistant
 */

import type { SubscriptionPlanId } from "../../club-management/types";

/**
 * DTO pour l'inscription Coach
 * Endpoint: POST /auth/signup/coach
 */
export interface SignupCoachDto {
  // Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  // Informations du club
  clubName: string;
  clubDescription?: string;

  // Plan d'abonnement
  planId: SubscriptionPlanId; // "BETA" | "STARTER" | "PRO"
}

/**
 * DTO pour l'inscription Player
 * Endpoint: POST /auth/signup/player
 */
export interface SignupPlayerDto {
  // Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  // Token d'invitation
  invitationToken: string;
}

/**
 * DTO pour l'inscription Assistant Coach
 * Endpoint: POST /auth/signup/assistant
 */
export interface SignupAssistantDto {
  // Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  // Token d'invitation
  invitationToken: string;
}

/**
 * Réponse de l'API après inscription
 */
export interface SignupResponse {
  // Token JWT pour l'authentification (camelCase depuis le backend)
  accessToken: string;

  // Informations utilisateur
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "USER" | "ADMIN";
    clubId: string | null;
    clubRole: "COACH" | "ASSISTANT_COACH" | "PLAYER" | null;
  };

  // Informations supplémentaires pour le coach
  clubId?: string;
  subscriptionId?: string;

  // Flag pour les joueurs qui changent de club
  hadPreviousClub?: boolean;

  // URL de redirection Stripe (pour les plans payants)
  checkoutUrl?: string;
}

/**
 * Validation d'invitation (pour Player et Assistant)
 */
export interface InvitationValidation {
  isValid: boolean;
  clubName?: string;
  clubId?: string;
  invitationType?: "PLAYER" | "ASSISTANT_COACH";
  expiresAt?: Date;
  error?: string;
}
