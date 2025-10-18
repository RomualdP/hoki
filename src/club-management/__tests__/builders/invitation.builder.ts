import { Invitation } from '../../domain/entities/invitation.entity';
import { InvitationType } from '../../domain/value-objects/invitation-type.vo';

/**
 * Builder for creating Invitation test instances with fluent API
 *
 * Provides preset methods for common invitation types and states
 *
 * Usage:
 * ```typescript
 * // Basic player invitation
 * const invitation = new InvitationBuilder().forPlayer().build();
 *
 * // Assistant coach invitation that's expired
 * const invitation = new InvitationBuilder()
 *   .forAssistantCoach()
 *   .expired()
 *   .build();
 *
 * // Used invitation
 * const invitation = new InvitationBuilder()
 *   .forPlayer()
 *   .used('user-2')
 *   .build();
 * ```
 */
export class InvitationBuilder {
  private props: {
    id: string;
    token: string;
    clubId: string;
    type: InvitationType;
    createdBy: string;
    expiresInDays?: number;
    expiresAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    usedAt?: Date | null;
    usedBy?: string | null;
  };

  constructor() {
    // Default to PLAYER invitation
    this.props = {
      id: 'invitation-1',
      token: 'token-123',
      clubId: 'club-1',
      type: InvitationType.PLAYER,
      createdBy: 'coach-1',
      expiresInDays: 7,
    };
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withToken(token: string): this {
    this.props.token = token;
    return this;
  }

  withClubId(clubId: string): this {
    this.props.clubId = clubId;
    return this;
  }

  withCreatedBy(createdBy: string): this {
    this.props.createdBy = createdBy;
    return this;
  }

  /**
   * Configure as PLAYER invitation
   */
  forPlayer(): this {
    this.props.type = InvitationType.PLAYER;
    return this;
  }

  /**
   * Configure as ASSISTANT_COACH invitation
   */
  forAssistantCoach(): this {
    this.props.type = InvitationType.ASSISTANT_COACH;
    return this;
  }

  /**
   * Set custom expiration in days (for create())
   */
  withExpiresInDays(days: number): this {
    this.props.expiresInDays = days;
    delete this.props.expiresAt;
    return this;
  }

  /**
   * Set custom expiration date (for reconstitute())
   */
  withExpiresAt(expiresAt: Date): this {
    this.props.expiresAt = expiresAt;
    delete this.props.expiresInDays;
    return this;
  }

  /**
   * Make the invitation expired (past date)
   */
  expired(): this {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    this.props.expiresAt = pastDate;
    delete this.props.expiresInDays;
    return this;
  }

  /**
   * Make the invitation valid but expiring soon (1 hour)
   */
  expiringSoon(): this {
    const soonDate = new Date();
    soonDate.setHours(soonDate.getHours() + 1);
    this.props.expiresAt = soonDate;
    delete this.props.expiresInDays;
    return this;
  }

  /**
   * Mark the invitation as used
   */
  used(userId: string): this {
    this.props.usedAt = new Date();
    this.props.usedBy = userId;
    return this;
  }

  /**
   * Set timestamps for reconstitution
   */
  withTimestamps(createdAt: Date, updatedAt: Date): this {
    this.props.createdAt = createdAt;
    this.props.updatedAt = updatedAt;
    return this;
  }

  /**
   * Build the Invitation entity
   */
  build(): Invitation {
    // Use reconstitute if we have expiresAt or usedAt/usedBy
    if (
      this.props.expiresAt ||
      this.props.usedAt !== undefined ||
      this.props.usedBy !== undefined ||
      this.props.createdAt ||
      this.props.updatedAt
    ) {
      return Invitation.reconstitute({
        id: this.props.id,
        token: this.props.token,
        clubId: this.props.clubId,
        type: this.props.type,
        expiresAt: this.props.expiresAt || this.calculateExpiresAt(),
        createdBy: this.props.createdBy,
        createdAt: this.props.createdAt || new Date(),
        updatedAt: this.props.updatedAt || new Date(),
        usedAt: this.props.usedAt ?? null,
        usedBy: this.props.usedBy ?? null,
      });
    }

    // Use create for new invitations
    return Invitation.create({
      id: this.props.id,
      token: this.props.token,
      clubId: this.props.clubId,
      type: this.props.type,
      createdBy: this.props.createdBy,
      expiresInDays: this.props.expiresInDays,
    });
  }

  private calculateExpiresAt(): Date {
    const date = new Date();
    date.setDate(date.getDate() + (this.props.expiresInDays || 7));
    return date;
  }
}
