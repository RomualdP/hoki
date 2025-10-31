/**
 * Invitations API Client
 *
 * API client for invitation-related endpoints
 */

import { get, post } from "./api-client";
import type {
  Invitation,
  GenerateInvitationDto,
  AcceptInvitationDto,
  InvitationValidation,
} from "../types";

/**
 * Generate an invitation link for a club
 */
export async function generateInvitation(
  data: GenerateInvitationDto,
): Promise<{ token: string }> {
  return post<{ token: string }>("/invitations/generate", data);
}

/**
 * Validate an invitation token
 */
export async function validateInvitation(
  token: string,
): Promise<InvitationValidation> {
  return get<InvitationValidation>(`/invitations/validate/${token}`);
}

/**
 * Accept an invitation
 */
export async function acceptInvitation(
  data: AcceptInvitationDto,
): Promise<void> {
  return post<void>("/invitations/accept", data);
}

/**
 * Get invitation details by token
 */
export async function getInvitation(token: string): Promise<Invitation> {
  return get<Invitation>(`/invitations/${token}`);
}
