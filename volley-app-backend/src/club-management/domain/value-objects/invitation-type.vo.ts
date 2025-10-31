import { InvalidInvitationTypeException } from '../exceptions';

/**
 * InvitationType - Value Object
 *
 * Immutable value object representing the type of invitation.
 * Encapsulates invitation type-specific behavior and validation.
 */

import { ClubRole } from './club-role.vo';

/**
 * InvitationType enum - represents valid invitation types
 */
export enum InvitationType {
  PLAYER = 'PLAYER',
  COACH = 'COACH',
}

export class InvitationTypeVO {
  private constructor(public readonly value: InvitationType) {}

  /**
   * Factory method to create an InvitationType value object from enum
   */
  static create(type: InvitationType): InvitationTypeVO {
    if (!Object.values(InvitationType).includes(type)) {
      throw new InvalidInvitationTypeException(type);
    }

    return new InvitationTypeVO(type);
  }

  /**
   * Factory method to create an InvitationType value object from string (for Prisma)
   */
  static fromString(typeString: string): InvitationTypeVO {
    const type = typeString as InvitationType;

    if (!Object.values(InvitationType).includes(type)) {
      throw new InvalidInvitationTypeException(typeString);
    }

    return new InvitationTypeVO(type);
  }

  /**
   * Factory methods for each invitation type
   */
  static player(): InvitationTypeVO {
    return new InvitationTypeVO(InvitationType.PLAYER);
  }

  static coach(): InvitationTypeVO {
    return new InvitationTypeVO(InvitationType.COACH);
  }

  /**
   * Type checks
   */
  isPlayer(): boolean {
    return this.value === InvitationType.PLAYER;
  }

  isCoach(): boolean {
    return this.value === InvitationType.COACH;
  }

  /**
   * Get the corresponding ClubRole for this invitation type
   */
  toClubRole(): ClubRole {
    const roleMapping = {
      [InvitationType.PLAYER]: ClubRole.PLAYER,
      [InvitationType.COACH]: ClubRole.COACH,
    };

    return roleMapping[this.value];
  }

  /**
   * Get display name
   */
  getDisplayName(): string {
    const displayNames = {
      [InvitationType.PLAYER]: 'Player',
      [InvitationType.COACH]: 'Coach',
    };

    return displayNames[this.value];
  }

  /**
   * Get description
   */
  getDescription(): string {
    const descriptions = {
      [InvitationType.PLAYER]:
        'Invite a player to join your club and participate in team activities',
      [InvitationType.COACH]: 'Invite a coach to help manage teams and members',
    };

    return descriptions[this.value];
  }

  /**
   * Get signup route path
   */
  getSignupPath(): string {
    const paths = {
      [InvitationType.PLAYER]: 'signup/player',
      [InvitationType.COACH]: 'signup/coach',
    };

    return paths[this.value];
  }

  /**
   * Generate invitation link
   *
   * @param baseUrl - Base URL of the application
   * @param token - Invitation token
   */
  generateLink(baseUrl: string, token: string): string {
    return `${baseUrl}/${this.getSignupPath()}?token=${token}`;
  }

  /**
   * Get invitation email subject
   */
  getEmailSubject(clubName: string): string {
    if (this.isPlayer()) {
      return `You're invited to join ${clubName} as a player`;
    }

    return `You're invited to join ${clubName} as a coach`;
  }

  /**
   * Get invitation email body template
   */
  getEmailBodyTemplate(clubName: string, inviterName: string): string {
    if (this.isPlayer()) {
      return `
        Hi there!

        ${inviterName} has invited you to join ${clubName} as a player.

        Click the link below to accept the invitation and create your account.
      `;
    }

    return `
      Hi there!

      ${inviterName} has invited you to join ${clubName} as a coach.

      As a coach, you'll be able to help manage teams and members.

      Click the link below to accept the invitation and create your account.
    `;
  }

  /**
   * Validate that this invitation type can be created by the given role
   */
  canBeCreatedBy(creatorRole: ClubRole): boolean {
    // Only OWNER and COACH can create invitations
    return creatorRole === ClubRole.OWNER || creatorRole === ClubRole.COACH;
  }

  /**
   * Value object equality
   */
  equals(other: InvitationTypeVO): boolean {
    return this.value === other.value;
  }

  /**
   * Convert to string
   */
  toString(): string {
    return this.value;
  }
}
