/**
 * ClubRole - Value Object
 *
 * Immutable value object representing a member's role within a club.
 * Encapsulates role-specific behavior and permission checks.
 */

import { ClubRole as ClubRoleEnum } from '../entities/member.entity';

export class ClubRoleVO {
  private constructor(public readonly value: ClubRoleEnum) {}

  /**
   * Factory method to create a ClubRole value object
   */
  static create(role: ClubRoleEnum): ClubRoleVO {
    if (!Object.values(ClubRoleEnum).includes(role)) {
      throw new Error(`Invalid club role: ${role}`);
    }

    return new ClubRoleVO(role);
  }

  /**
   * Factory methods for each role type
   */
  static coach(): ClubRoleVO {
    return new ClubRoleVO(ClubRoleEnum.COACH);
  }

  static assistantCoach(): ClubRoleVO {
    return new ClubRoleVO(ClubRoleEnum.ASSISTANT_COACH);
  }

  static player(): ClubRoleVO {
    return new ClubRoleVO(ClubRoleEnum.PLAYER);
  }

  /**
   * Type checks
   */
  isCoach(): boolean {
    return this.value === ClubRoleEnum.COACH;
  }

  isAssistantCoach(): boolean {
    return this.value === ClubRoleEnum.ASSISTANT_COACH;
  }

  isPlayer(): boolean {
    return this.value === ClubRoleEnum.PLAYER;
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
      [ClubRoleEnum.COACH]: 'Coach',
      [ClubRoleEnum.ASSISTANT_COACH]: 'Assistant Coach',
      [ClubRoleEnum.PLAYER]: 'Player',
    };

    return displayNames[this.value];
  }

  /**
   * Get description
   */
  getDescription(): string {
    const descriptions = {
      [ClubRoleEnum.COACH]:
        'Full access to club management, subscription, and all features',
      [ClubRoleEnum.ASSISTANT_COACH]:
        'Can manage teams and invite members, but cannot modify club settings or subscription',
      [ClubRoleEnum.PLAYER]:
        'Can view club information and participate in team activities',
    };

    return descriptions[this.value];
  }

  /**
   * Get role hierarchy level (higher = more permissions)
   */
  getHierarchyLevel(): number {
    const levels = {
      [ClubRoleEnum.PLAYER]: 1,
      [ClubRoleEnum.ASSISTANT_COACH]: 2,
      [ClubRoleEnum.COACH]: 3,
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
