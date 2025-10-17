/**
 * IMemberRepository - Domain Repository Interface
 *
 * Defines the contract for Member persistence operations.
 * This interface belongs to the Domain layer and will be implemented
 * in the Infrastructure layer.
 */

import { Member, ClubRole } from '../entities/member.entity';

export interface IMemberRepository {
  /**
   * Save a new member to persistence
   */
  save(member: Member): Promise<Member>;

  /**
   * Update an existing member
   */
  update(member: Member): Promise<Member>;

  /**
   * Find a member by its ID
   */
  findById(id: string): Promise<Member | null>;

  /**
   * Find a member by user ID and club ID
   */
  findByUserIdAndClubId(userId: string, clubId: string): Promise<Member | null>;

  /**
   * Find all members of a club
   */
  findByClubId(clubId: string): Promise<Member[]>;

  /**
   * Find all active members of a club
   */
  findActiveByClubId(clubId: string): Promise<Member[]>;

  /**
   * Find all members of a club with a specific role
   */
  findByClubIdAndRole(clubId: string, role: ClubRole): Promise<Member[]>;

  /**
   * Find all active members of a club with a specific role
   */
  findActiveByClubIdAndRole(clubId: string, role: ClubRole): Promise<Member[]>;

  /**
   * Find all memberships (past and present) of a user
   */
  findByUserId(userId: string): Promise<Member[]>;

  /**
   * Find the current active membership of a user
   */
  findActiveByUserId(userId: string): Promise<Member | null>;

  /**
   * Find members invited by a specific user
   */
  findByInviterId(inviterId: string): Promise<Member[]>;

  /**
   * Check if a user is already a member of a club
   */
  existsByUserIdAndClubId(userId: string, clubId: string): Promise<boolean>;

  /**
   * Delete a member by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Count members of a club
   */
  countByClubId(clubId: string): Promise<number>;

  /**
   * Count active members of a club
   */
  countActiveByClubId(clubId: string): Promise<number>;

  /**
   * Count members of a club by role
   */
  countByClubIdAndRole(clubId: string, role: ClubRole): Promise<number>;
}

/**
 * Repository token for dependency injection
 */
export const MEMBER_REPOSITORY = Symbol('MEMBER_REPOSITORY');
