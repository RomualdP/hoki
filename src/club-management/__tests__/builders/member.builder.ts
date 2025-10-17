import { Member, ClubRole } from '../../domain/entities/member.entity';

/**
 * Builder for creating Member test instances with fluent API
 *
 * Provides preset methods for common roles (COACH, ASSISTANT_COACH, PLAYER)
 *
 * Usage:
 * ```typescript
 * // Basic player member
 * const member = new MemberBuilder().asPlayer().build();
 *
 * // Coach with custom IDs
 * const member = new MemberBuilder()
 *   .asCoach()
 *   .withUserId('coach-1')
 *   .withClubId('club-1')
 *   .build();
 *
 * // Inactive member (has left)
 * const member = new MemberBuilder()
 *   .asPlayer()
 *   .inactive()
 *   .build();
 * ```
 */
export class MemberBuilder {
  private props: {
    id: string;
    userId: string;
    clubId: string;
    role: ClubRole;
    joinedAt?: Date;
    leftAt?: Date | null;
    invitedBy?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  };

  constructor() {
    // Default to PLAYER role
    this.props = {
      id: 'member-1',
      userId: 'user-1',
      clubId: 'club-1',
      role: ClubRole.PLAYER,
      invitedBy: 'coach-1',
    };
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withUserId(userId: string): this {
    this.props.userId = userId;
    return this;
  }

  withClubId(clubId: string): this {
    this.props.clubId = clubId;
    return this;
  }

  withInvitedBy(invitedBy: string | null): this {
    this.props.invitedBy = invitedBy;
    return this;
  }

  /**
   * Configure as COACH role
   */
  asCoach(): this {
    this.props.role = ClubRole.COACH;
    this.props.invitedBy = null; // Coaches are not invited
    return this;
  }

  /**
   * Configure as ASSISTANT_COACH role
   */
  asAssistantCoach(): this {
    this.props.role = ClubRole.ASSISTANT_COACH;
    this.props.invitedBy = this.props.invitedBy ?? 'coach-1';
    return this;
  }

  /**
   * Configure as PLAYER role
   */
  asPlayer(): this {
    this.props.role = ClubRole.PLAYER;
    this.props.invitedBy = this.props.invitedBy ?? 'coach-1';
    return this;
  }

  /**
   * Mark member as inactive (has left the club)
   */
  inactive(): this {
    this.props.leftAt = new Date();
    return this;
  }

  /**
   * Set custom leftAt date
   */
  withLeftAt(leftAt: Date | null): this {
    this.props.leftAt = leftAt;
    return this;
  }

  /**
   * Set custom joinedAt date
   */
  withJoinedAt(joinedAt: Date): this {
    this.props.joinedAt = joinedAt;
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
   * Build the Member entity
   */
  build(): Member {
    // Use reconstitute if we have joinedAt/leftAt/timestamps
    if (
      this.props.joinedAt ||
      this.props.leftAt !== undefined ||
      this.props.createdAt ||
      this.props.updatedAt
    ) {
      return Member.reconstitute({
        id: this.props.id,
        userId: this.props.userId,
        clubId: this.props.clubId,
        role: this.props.role,
        joinedAt: this.props.joinedAt || new Date(),
        leftAt: this.props.leftAt ?? null,
        invitedBy: this.props.invitedBy ?? null,
        createdAt: this.props.createdAt || new Date(),
        updatedAt: this.props.updatedAt || new Date(),
      });
    }

    // Use create for new members
    return Member.create({
      id: this.props.id,
      userId: this.props.userId,
      clubId: this.props.clubId,
      role: this.props.role,
      invitedBy: this.props.invitedBy,
    });
  }
}
