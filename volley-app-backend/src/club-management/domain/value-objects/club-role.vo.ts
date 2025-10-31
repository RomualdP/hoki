import { InvalidMemberRoleException } from '../exceptions';

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
  OWNER = 'OWNER',
  COACH = 'COACH',
  PLAYER = 'PLAYER',
}

export class ClubRoleVO {
  private constructor(public readonly value: ClubRole) {}

  /**
   * Factory method to create a ClubRole value object from enum
   */
  static create(role: ClubRole): ClubRoleVO {
    if (!Object.values(ClubRole).includes(role)) {
      throw new InvalidMemberRoleException(role);
    }

    return new ClubRoleVO(role);
  }

  /**
   * Factory method to create a ClubRole value object from string (for Prisma)
   */
  static fromString(roleString: string): ClubRoleVO {
    const role = roleString as ClubRole;

    if (!Object.values(ClubRole).includes(role)) {
      throw new InvalidMemberRoleException(roleString);
    }

    return new ClubRoleVO(role);
  }

  /**
   * Factory methods for each role type
   */
  static owner(): ClubRoleVO {
    return new ClubRoleVO(ClubRole.OWNER);
  }

  static coach(): ClubRoleVO {
    return new ClubRoleVO(ClubRole.COACH);
  }

  static player(): ClubRoleVO {
    return new ClubRoleVO(ClubRole.PLAYER);
  }

  /**
   * Type checks
   */
  isOwner(): boolean {
    return this.value === ClubRole.OWNER;
  }

  isCoach(): boolean {
    return this.value === ClubRole.COACH;
  }

  isPlayer(): boolean {
    return this.value === ClubRole.PLAYER;
  }

  /**
   * Check if role is a coaching role (OWNER or COACH)
   */
  isCoachingRole(): boolean {
    return this.isOwner() || this.isCoach();
  }

  /**
   * Permission checks
   */
  canManageClubSettings(): boolean {
    return this.isCoachingRole();
  }

  canManageSubscription(): boolean {
    return this.isOwner();
  }

  canManageTeams(): boolean {
    return this.isCoachingRole();
  }

  canInviteMembers(): boolean {
    return this.isCoachingRole();
  }

  canRemoveMembers(): boolean {
    return this.isCoachingRole();
  }

  canEditTeamMembers(): boolean {
    return this.isCoachingRole();
  }

  canDeleteClub(): boolean {
    return this.isCoachingRole();
  }

  canTransferOwnership(): boolean {
    return this.isOwner();
  }

  /**
   * Get display name
   */
  getDisplayName(): string {
    const displayNames = {
      [ClubRole.OWNER]: 'Owner',
      [ClubRole.COACH]: 'Coach',
      [ClubRole.PLAYER]: 'Player',
    };

    return displayNames[this.value];
  }

  /**
   * Get description
   */
  getDescription(): string {
    const descriptions = {
      [ClubRole.OWNER]:
        'Full access to club management, subscription, and all features',
      [ClubRole.COACH]:
        'Can manage teams, invite members, and manage club settings, but cannot modify subscription',
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
      [ClubRole.COACH]: 2,
      [ClubRole.OWNER]: 3,
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
