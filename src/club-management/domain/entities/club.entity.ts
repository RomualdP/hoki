/**
 * Club - Domain Entity (Rich Domain Model)
 *
 * Represents a volleyball club in the system.
 * Encapsulates business logic related to club management.
 */

import {
  ClubNameEmptyException,
  ClubNameTooLongException,
  ClubOwnerRequiredException,
  ClubNameAlreadyExistsException,
} from '../exceptions';

export class Club {
  private constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public logo: string | null,
    public location: string | null,
    public readonly ownerId: string, // The COACH who created the club
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * Factory method to create a new Club
   */
  static create(props: {
    id: string;
    name: string;
    description?: string;
    logo?: string;
    location?: string;
    ownerId: string;
  }): Club {
    // Business validations
    if (!props.name || props.name.trim().length === 0) {
      throw new ClubNameEmptyException();
    }

    if (props.name.length > 100) {
      throw new ClubNameTooLongException();
    }

    if (!props.ownerId) {
      throw new ClubOwnerRequiredException();
    }

    const now = new Date();

    return new Club(
      props.id,
      props.name.trim(),
      props.description?.trim() || null,
      props.logo || null,
      props.location?.trim() || null,
      props.ownerId,
      now,
      now,
    );
  }

  /**
   * Factory method to reconstitute a Club from persistence
   */
  static reconstitute(props: {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    location: string | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Club {
    return new Club(
      props.id,
      props.name,
      props.description,
      props.logo,
      props.location,
      props.ownerId,
      props.createdAt,
      props.updatedAt,
    );
  }

  /**
   * Update club information
   */
  update(props: {
    name?: string;
    description?: string | null;
    logo?: string | null;
    location?: string | null;
  }): void {
    if (props.name !== undefined) {
      if (!props.name || props.name.trim().length === 0) {
        throw new ClubNameEmptyException();
      }
      if (props.name.length > 100) {
        throw new ClubNameTooLongException();
      }
      this.name = props.name.trim();
    }

    if (props.description !== undefined) {
      this.description = props.description?.trim() || null;
    }

    if (props.logo !== undefined) {
      this.logo = props.logo;
    }

    if (props.location !== undefined) {
      this.location = props.location?.trim() || null;
    }

    this.updatedAt = new Date();
  }

  /**
   * Check if a user is the owner of the club
   */
  isOwner(userId: string): boolean {
    return this.ownerId === userId;
  }

  /**
   * Business rule: Validate club name uniqueness
   * Note: This should be enforced at the repository level with unique constraints
   */
  static validateNameUniqueness(
    name: string,
    existingClubNames: string[],
  ): void {
    const normalizedName = name.trim().toLowerCase();
    const isDuplicate = existingClubNames.some(
      (existingName) => existingName.toLowerCase() === normalizedName,
    );

    if (isDuplicate) {
      throw new ClubNameAlreadyExistsException();
    }
  }
}
