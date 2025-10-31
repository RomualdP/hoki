/**
 * IClubRepository - Domain Repository Interface
 *
 * Defines the contract for Club persistence operations.
 * This interface belongs to the Domain layer and will be implemented
 * in the Infrastructure layer.
 *
 * Following DDD principles:
 * - Domain defines the contract (interface)
 * - Infrastructure provides the implementation
 * - This achieves Dependency Inversion (SOLID)
 */

import { Club } from '../entities/club.entity';

export interface IClubRepository {
  /**
   * Save a new club to persistence
   */
  save(club: Club): Promise<Club>;

  /**
   * Update an existing club
   */
  update(club: Club): Promise<Club>;

  /**
   * Find a club by its ID
   */
  findById(id: string): Promise<Club | null>;

  /**
   * Find a club by owner ID
   */
  findByOwnerId(ownerId: string): Promise<Club | null>;

  /**
   * Find all clubs (with optional pagination)
   */
  findAll(options?: {
    skip?: number;
    take?: number;
    searchTerm?: string;
  }): Promise<Club[]>;

  /**
   * Check if a club with the given name already exists
   */
  existsByName(name: string): Promise<boolean>;

  /**
   * Get all club names (for uniqueness validation)
   */
  getAllClubNames(): Promise<string[]>;

  /**
   * Delete a club by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Count total clubs (useful for pagination)
   */
  count(searchTerm?: string): Promise<number>;
}

/**
 * Repository token for dependency injection
 */
export const CLUB_REPOSITORY = Symbol('CLUB_REPOSITORY');
