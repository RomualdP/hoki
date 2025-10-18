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
  ASSISTANT_COACH = 'ASSISTANT_COACH',
}

export class InvitationTypeVO {
  private constructor(public readonly value: InvitationType) {}

  /**
   * Factory method to create an InvitationType value object from enum
   */
  static create(type: InvitationType): InvitationTypeVO {
    if (!Object.values(InvitationType).includes(type)) {
      throw new Error(`Invalid invitation type: ${type}`);
    }

    return new InvitationTypeVO(type);
  }

  /**
   * Factory method to create an InvitationType value object from string (for Prisma)
   */
  static fromString(typeString: string): InvitationTypeVO {
    const type = typeString as InvitationType;

    if (!Object.values(InvitationType).includes(type)) {
      throw new Error(`Invalid invitation type string: ${typeString}`);
    }

    return new InvitationTypeVO(type);
  }

  /**
   * Factory methods for each invitation type
   */
  static player(): InvitationTypeVO {
    return new InvitationTypeVO(InvitationType.PLAYER);
  }

  static assistantCoach(): InvitationTypeVO {
    return new InvitationTypeVO(InvitationType.ASSISTANT_COACH);
  }

  /**
   * Type checks
   */
  isPlayer(): boolean {
    return this.value === InvitationType.PLAYER;
  }

  isAssistantCoach(): boolean {
    return this.value === InvitationType.ASSISTANT_COACH;
  }

  /**
   * Get the corresponding ClubRole for this invitation type
   */
  toClubRole(): ClubRole {
    const roleMapping = {
      [InvitationType.PLAYER]: ClubRole.PLAYER,
      [InvitationType.ASSISTANT_COACH]: ClubRole.ASSISTANT_COACH,
    };

    return roleMapping[this.value];
  }

  /**
   * Get display name
   */
  getDisplayName(): string {
    const displayNames = {
      [InvitationType.PLAYER]: 'Player',
      [InvitationType.ASSISTANT_COACH]: 'Assistant Coach',
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
      [InvitationType.ASSISTANT_COACH]:
        'Invite an assistant coach to help manage teams and members',
    };

    return descriptions[this.value];
  }

  /**
   * Get signup route path
   */
  getSignupPath(): string {
    const paths = {
      [InvitationType.PLAYER]: 'signup/player',
      [InvitationType.ASSISTANT_COACH]: 'signup/assistant',
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

    return `You're invited to join ${clubName} as an assistant coach`;
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

      ${inviterName} has invited you to join ${clubName} as an assistant coach.

      As an assistant coach, you'll be able to help manage teams and members.

      Click the link below to accept the invitation and create your account.
    `;
  }

  /**
   * Validate that this invitation type can be created by the given role
   */
  canBeCreatedBy(creatorRole: ClubRole): boolean {
    // Only COACH and ASSISTANT_COACH can create invitations
    return (
      creatorRole === ClubRole.COACH || creatorRole === ClubRole.ASSISTANT_COACH
    );
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
