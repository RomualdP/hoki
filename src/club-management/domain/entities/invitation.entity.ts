/**
 * Invitation - Domain Entity (Rich Domain Model)
 *
 * Represents an invitation token for users to join a club.
 * Encapsulates business logic related to invitation lifecycle and validation.
 */

import { InvitationType } from '../value-objects/invitation-type.vo';

export class Invitation {
  private constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly clubId: string,
    public readonly type: InvitationType,
    public readonly createdBy: string, // userId of the coach who created the invitation
    public readonly expiresAt: Date,
    public usedAt: Date | null,
    public usedBy: string | null, // userId who used the invitation
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * Factory method to create a new Invitation
   */
  static create(props: {
    id: string;
    token: string;
    clubId: string;
    type: InvitationType;
    createdBy: string;
    expiresInDays?: number; // Default: 7 days
  }): Invitation {
    if (!props.token || props.token.trim().length === 0) {
      throw new Error('Invitation token cannot be empty');
    }

    if (!props.clubId) {
      throw new Error('Invitation must be associated with a club');
    }

    if (!props.createdBy) {
      throw new Error('Invitation must have a creator');
    }

    const now = new Date();
    const expiresInDays = props.expiresInDays || 7;
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    return new Invitation(
      props.id,
      props.token,
      props.clubId,
      props.type,
      props.createdBy,
      expiresAt,
      null,
      null,
      now,
      now,
    );
  }

  /**
   * Factory method to reconstitute an Invitation from persistence
   */
  static reconstitute(props: {
    id: string;
    token: string;
    clubId: string;
    type: InvitationType;
    createdBy: string;
    expiresAt: Date;
    usedAt: Date | null;
    usedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Invitation {
    return new Invitation(
      props.id,
      props.token,
      props.clubId,
      props.type,
      props.createdBy,
      props.expiresAt,
      props.usedAt,
      props.usedBy,
      props.createdAt,
      props.updatedAt,
    );
  }

  /**
   * Business Logic: Check if the invitation has expired
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Business Logic: Check if the invitation is valid (not expired and not used)
   */
  isValid(): boolean {
    return !this.isExpired() && !this.isUsed();
  }

  /**
   * Check if the invitation has been used
   */
  isUsed(): boolean {
    return this.usedAt !== null;
  }

  /**
   * Business Logic: Mark invitation as used
   *
   * @param userId - The user who is using the invitation
   * @throws Error if invitation is already used or expired
   */
  markAsUsed(userId: string): void {
    if (this.isUsed()) {
      throw new Error('Invitation has already been used');
    }

    if (this.isExpired()) {
      throw new Error('Invitation has expired');
    }

    if (!userId) {
      throw new Error('User ID is required to mark invitation as used');
    }

    this.usedAt = new Date();
    this.usedBy = userId;
    this.updatedAt = new Date();
  }

  /**
   * Get invitation status as a human-readable string
   */
  getStatus(): 'valid' | 'expired' | 'used' {
    if (this.isUsed()) {
      return 'used';
    }

    if (this.isExpired()) {
      return 'expired';
    }

    return 'valid';
  }

  /**
   * Get remaining time before expiration in days
   */
  getRemainingDays(): number {
    if (this.isExpired()) {
      return 0;
    }

    const now = new Date();
    const diffMs = this.expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  /**
   * Business rule: Validate that the user accepting the invitation
   * is not the creator of the invitation
   */
  validateUserIsNotCreator(userId: string): void {
    if (this.createdBy === userId) {
      throw new Error('Cannot accept your own invitation');
    }
  }

  /**
   * Generate a shareable invitation link
   *
   * @param baseUrl - Base URL of the application
   * @returns Full invitation URL
   */
  generateLink(baseUrl: string): string {
    const endpoint =
      this.type === InvitationType.PLAYER
        ? 'signup/player'
        : 'signup/assistant';
    return `${baseUrl}/${endpoint}?token=${this.token}`;
  }
}
