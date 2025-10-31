/**
 * Read Model for invitation details
 * Optimized for invitation validation and display
 */
export interface InvitationDetailReadModel {
  id: string;
  token: string;
  type: string; // 'PLAYER' | 'COACH'

  // Club information
  clubId: string;
  clubName: string;

  // Expiration data
  expiresAt: Date;
  remainingDays: number;

  // Status
  status: 'valid' | 'expired' | 'used';

  // Metadata
  createdBy: string;
  createdAt: Date;
  usedAt?: Date;
  usedBy?: string;

  // Computed fields for UI
  isValid: boolean;
  isExpired: boolean;
  isUsed: boolean;
  canBeUsed: boolean; // !expired && !used
}
