/**
 * ClubRole - Value Object
 *
 * Immutable value object representing a member's role within a club.
 * Encapsulates role-specific behavior and permission checks.
 */

/**
 * ClubRole enum - represents valid club roles
 */
export enum ClubRole {
  COACH = 'COACH',
  ASSISTANT_COACH = 'ASSISTANT_COACH',
  PLAYER = 'PLAYER',
}

export class ClubRoleVO {
  private constructor(public readonly value: ClubRole) {}

  /**
   * Factory method to create a ClubRole value object from enum
   */
  static create(role: ClubRole): ClubRoleVO {
    if (!Object.values(ClubRole).includes(role)) {
      throw new Error(`Invalid club role: ${role}`);
    }

    return new ClubRoleVO(role);
  }

  /**
   * Factory method to create a ClubRole value object from string (for Prisma)
   */
  static fromString(roleString: string): ClubRoleVO {
    const role = roleString as ClubRole;

    if (!Object.values(ClubRole).includes(role)) {
      throw new Error(`Invalid club role string: ${roleString}`);
    }

    return new ClubRoleVO(role);
  }

  /**
   * Factory methods for each role type
   */
  static coach(): ClubRoleVO {
    return new ClubRoleVO(ClubRole.COACH);
  }

  static assistantCoach(): ClubRoleVO {
    return new ClubRoleVO(ClubRole.ASSISTANT_COACH);
  }

  static player(): ClubRoleVO {
    return new ClubRoleVO(ClubRole.PLAYER);
  }

  /**
   * Type checks
   */
  isCoach(): boolean {
    return this.value === ClubRole.COACH;
  }

  isAssistantCoach(): boolean {
    return this.value === ClubRole.ASSISTANT_COACH;
  }

  isPlayer(): boolean {
    return this.value === ClubRole.PLAYER;
  }

  /**
   * Check if role is a coaching role (COACH or ASSISTANT_COACH)
   */
  isCoachingRole(): boolean {
    return this.isCoach() || this.isAssistantCoach();
  }

  /**
   * Permission checks
   */
  canManageClubSettings(): boolean {
    return this.isCoach();
  }

  canManageSubscription(): boolean {
    return this.isCoach();
  }

  canManageTeams(): boolean {
    return this.isCoachingRole();
  }

  canInviteMembers(): boolean {
    return this.isCoachingRole();
  }

  canRemoveMembers(): boolean {
    return this.isCoach();
  }

  canEditTeamMembers(): boolean {
    return this.isCoachingRole();
  }

  canDeleteClub(): boolean {
    return this.isCoach();
  }

  canTransferOwnership(): boolean {
    return this.isCoach();
  }

  /**
   * Get display name
   */
  getDisplayName(): string {
    const displayNames = {
      [ClubRole.COACH]: 'Coach',
      [ClubRole.ASSISTANT_COACH]: 'Assistant Coach',
      [ClubRole.PLAYER]: 'Player',
    };

    return displayNames[this.value];
  }

  /**
   * Get description
   */
  getDescription(): string {
    const descriptions = {
      [ClubRole.COACH]:
        'Full access to club management, subscription, and all features',
      [ClubRole.ASSISTANT_COACH]:
        'Can manage teams and invite members, but cannot modify club settings or subscription',
      [ClubRole.PLAYER]:
        'Can view club information and participate in team activities',
    };

    return descriptions[this.value];
  }

  /**
   * Get role hierarchy level (higher = more permissions)
   */
  getHierarchyLevel(): number {
    const levels = {
      [ClubRole.PLAYER]: 1,
      [ClubRole.ASSISTANT_COACH]: 2,
      [ClubRole.COACH]: 3,
    };

    return levels[this.value];
  }

  /**
   * Compare roles by hierarchy
   */
  isHigherThan(other: ClubRoleVO): boolean {
    return this.getHierarchyLevel() > other.getHierarchyLevel();
  }

  isLowerThan(other: ClubRoleVO): boolean {
    return this.getHierarchyLevel() < other.getHierarchyLevel();
  }

  /**
   * Value object equality
   */
  equals(other: ClubRoleVO): boolean {
    return this.value === other.value;
  }

  /**
   * Convert to string
   */
  toString(): string {
    return this.value;
  }
}
