import {
  MemberUserRequiredException,
  MemberClubRequiredException,
  MemberAlreadyInactiveException,
  MemberLeftAtRequiredException,
  MemberInactiveException,
  MemberAlreadyHasRoleException,
  CannotChangeMemberRoleException,
  CannotRemoveSelfException,
  MemberInsufficientPermissionsException,
} from '../exceptions';

/**
 * Member - Domain Entity (Rich Domain Model)
 *
 * Represents a user's membership in a club with a specific role.
 * Encapsulates business logic related to club membership and permissions.
 */

import { ClubRole } from '../value-objects/club-role.vo';

export class Member {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly clubId: string,
    public role: ClubRole,
    public readonly joinedAt: Date,
    public leftAt: Date | null,
    public readonly invitedBy: string | null, // userId of the person who invited (null for COACH)
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * Factory method to create a new Member
   */
  static create(props: {
    id: string;
    userId: string;
    clubId: string;
    role: ClubRole;
    invitedBy?: string;
  }): Member {
    if (!props.userId) {
      throw new MemberUserRequiredException();
    }

    if (!props.clubId) {
      throw new MemberClubRequiredException();
    }

    const now = new Date();

    return new Member(
      props.id,
      props.userId,
      props.clubId,
      props.role,
      now,
      null,
      props.invitedBy || null,
      now,
      now,
    );
  }

  /**
   * Factory method to reconstitute a Member from persistence
   */
  static reconstitute(props: {
    id: string;
    userId: string;
    clubId: string;
    role: ClubRole;
    joinedAt: Date;
    leftAt: Date | null;
    invitedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Member {
    return new Member(
      props.id,
      props.userId,
      props.clubId,
      props.role,
      props.joinedAt,
      props.leftAt,
      props.invitedBy,
      props.createdAt,
      props.updatedAt,
    );
  }

  /**
   * Check if member is currently active (has not left the club)
   */
  isActive(): boolean {
    return this.leftAt === null;
  }

  /**
   * Mark member as having left the club
   */
  markAsLeft(): void {
    if (!this.isActive()) {
      throw new MemberAlreadyInactiveException();
    }

    if (this.role === ClubRole.COACH) {
      throw new CannotChangeMemberRoleException(
        'Coach cannot leave their own club. Club must be deleted or transferred.',
      );
    }

    this.leftAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Change member's role
   *
   * @param newRole - The new role to assign
   * @throws Error if role change is not allowed
   */
  changeRole(newRole: ClubRole): void {
    if (!this.isActive()) {
      throw new MemberInactiveException('change role');
    }

    if (this.role === newRole) {
      throw new MemberAlreadyHasRoleException(newRole);
    }

    // COACH role cannot be changed (must transfer ownership)
    if (this.role === ClubRole.COACH) {
      throw new CannotChangeMemberRoleException(
        'Cannot change role of club owner. Use ownership transfer instead.',
      );
    }

    // Cannot promote to COACH (must transfer ownership)
    if (newRole === ClubRole.COACH) {
      throw new CannotChangeMemberRoleException(
        'Cannot promote to COACH role. Use ownership transfer instead.',
      );
    }

    this.role = newRole;
    this.updatedAt = new Date();
  }

  /**
   * Permission checks
   */

  canManageClubSettings(): boolean {
    return this.role === ClubRole.COACH;
  }

  canManageSubscription(): boolean {
    return this.role === ClubRole.COACH;
  }

  canManageTeams(): boolean {
    return (
      this.role === ClubRole.COACH || this.role === ClubRole.ASSISTANT_COACH
    );
  }

  canInviteMembers(): boolean {
    return (
      this.role === ClubRole.COACH || this.role === ClubRole.ASSISTANT_COACH
    );
  }

  canRemoveMembers(): boolean {
    return this.role === ClubRole.COACH;
  }

  canEditTeamMembers(): boolean {
    return (
      this.role === ClubRole.COACH || this.role === ClubRole.ASSISTANT_COACH
    );
  }

  canViewClubStats(): boolean {
    // All active members can view club stats
    return this.isActive();
  }

  /**
   * Business rule: Validate that a member can be removed
   *
   * @param removerRole - Role of the person trying to remove this member
   * @throws Error if removal is not allowed
   */
  validateCanBeRemovedBy(removerRole: ClubRole): void {
    if (!this.isActive()) {
      throw new MemberInactiveException('remove');
    }

    // Only COACH can remove members
    if (removerRole !== ClubRole.COACH) {
      throw new MemberInsufficientPermissionsException();
    }

    // COACH cannot remove themselves
    if (this.role === ClubRole.COACH) {
      throw new CannotRemoveSelfException();
    }
  }

  /**
   * Get role display name
   */
  getRoleDisplayName(): string {
    const displayNames = {
      [ClubRole.COACH]: 'Coach',
      [ClubRole.ASSISTANT_COACH]: 'Assistant Coach',
      [ClubRole.PLAYER]: 'Player',
    };

    return displayNames[this.role];
  }

  /**
   * Get member tenure in days
   */
  getTenureDays(): number {
    const endDate = this.leftAt || new Date();
    const diffMs = endDate.getTime() - this.joinedAt.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }
}
