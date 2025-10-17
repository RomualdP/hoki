/**
 * IInvitationRepository - Domain Repository Interface
 *
 * Defines the contract for Invitation persistence operations.
 * This interface belongs to the Domain layer and will be implemented
 * in the Infrastructure layer.
 */

import { Invitation, InvitationType } from '../entities/invitation.entity';

export interface IInvitationRepository {
  /**
   * Save a new invitation to persistence
   */
  save(invitation: Invitation): Promise<Invitation>;

  /**
   * Update an existing invitation
   */
  update(invitation: Invitation): Promise<Invitation>;

  /**
   * Find an invitation by its ID
   */
  findById(id: string): Promise<Invitation | null>;

  /**
   * Find an invitation by its token
   */
  findByToken(token: string): Promise<Invitation | null>;

  /**
   * Find all invitations for a specific club
   */
  findByClubId(clubId: string): Promise<Invitation[]>;

  /**
   * Find all invitations created by a specific user
   */
  findByCreatorId(creatorId: string): Promise<Invitation[]>;

  /**
   * Find all invitations of a specific type
   */
  findByType(type: InvitationType): Promise<Invitation[]>;

  /**
   * Find all valid (not expired, not used) invitations for a club
   */
  findValidByClubId(clubId: string): Promise<Invitation[]>;

  /**
   * Find all expired invitations
   */
  findExpired(): Promise<Invitation[]>;

  /**
   * Find all used invitations
   */
  findUsed(): Promise<Invitation[]>;

  /**
   * Find all invitations used by a specific user
   */
  findUsedByUserId(userId: string): Promise<Invitation[]>;

  /**
   * Check if a token already exists
   */
  existsByToken(token: string): Promise<boolean>;

  /**
   * Delete an invitation by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Delete all expired invitations (cleanup task)
   */
  deleteExpired(): Promise<number>; // Returns count of deleted invitations

  /**
   * Count invitations for a club
   */
  countByClubId(clubId: string): Promise<number>;

  /**
   * Count valid invitations for a club
   */
  countValidByClubId(clubId: string): Promise<number>;
}

/**
 * Repository token for dependency injection
 */
export const INVITATION_REPOSITORY = Symbol('INVITATION_REPOSITORY');
