/**
 * Invitation Types
 *
 * Types for member invitations
 */

/**
 * Invitation type
 */
export type InvitationType = "ASSISTANT_COACH" | "PLAYER";

/**
 * Invitation detail - Matches InvitationDetailReadModel from backend
 */
export interface Invitation {
  id: string;
  token: string;
  type: InvitationType;
  clubId: string;
  clubName: string;
  expiresAt: Date;
  usedAt: Date | null;
  usedBy: string | null;
  isExpired: boolean;
  isUsed: boolean;
  isValid: boolean;
  createdAt: Date;
}

/**
 * DTO for generating an invitation
 */
export interface GenerateInvitationDto {
  clubId: string;
  type: InvitationType;
  expiresInDays?: number;
}

/**
 * DTO for accepting an invitation
 */
export interface AcceptInvitationDto {
  token: string;
  userId: string;
}

/**
 * Invitation validation response
 */
export interface InvitationValidation {
  isValid: boolean;
  clubName: string | null;
  type: InvitationType | null;
  errorMessage: string | null;
}
