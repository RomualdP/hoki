import { Club } from '../../domain/entities/club.entity';

/**
 * Builder for creating Club test instances with fluent API
 *
 * Provides sensible defaults and allows customization of specific fields
 *
 * Usage:
 * ```typescript
 * // Basic club with defaults
 * const club = new ClubBuilder().build();
 *
 * // Customized club
 * const club = new ClubBuilder()
 *   .withId('my-club-id')
 *   .withName('Paris Volleyball Club')
 *   .withDescription('Best club in Paris')
 *   .build();
 * ```
 */
export class ClubBuilder {
  private props: {
    id: string;
    name: string;
    ownerId: string;
    description?: string | null;
    logo?: string | null;
    location?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  };

  constructor() {
    // Sensible defaults for testing
    this.props = {
      id: 'club-1',
      name: 'Test Volleyball Club',
      ownerId: 'owner-1',
      description: null,
      logo: null,
      location: null,
    };
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withName(name: string): this {
    this.props.name = name;
    return this;
  }

  withOwnerId(ownerId: string): this {
    this.props.ownerId = ownerId;
    return this;
  }

  withDescription(description: string | null): this {
    this.props.description = description;
    return this;
  }

  withLogo(logo: string | null): this {
    this.props.logo = logo;
    return this;
  }

  withLocation(location: string | null): this {
    this.props.location = location;
    return this;
  }

  /**
   * Build a club with all optional fields populated
   */
  withAllFields(): this {
    this.props.description = 'A great volleyball club';
    this.props.logo = 'https://example.com/logo.png';
    this.props.location = 'Paris, France';
    return this;
  }

  /**
   * Build a club from reconstituted data (for testing persistence)
   */
  withTimestamps(createdAt: Date, updatedAt: Date): this {
    this.props.createdAt = createdAt;
    this.props.updatedAt = updatedAt;
    return this;
  }

  /**
   * Build the Club entity
   */
  build(): Club {
    if (this.props.createdAt && this.props.updatedAt) {
      return Club.reconstitute({
        id: this.props.id,
        name: this.props.name,
        ownerId: this.props.ownerId,
        description: this.props.description ?? null,
        logo: this.props.logo ?? null,
        location: this.props.location ?? null,
        createdAt: this.props.createdAt,
        updatedAt: this.props.updatedAt,
      });
    }

    return Club.create({
      id: this.props.id,
      name: this.props.name,
      ownerId: this.props.ownerId,
      description: this.props.description ?? undefined,
      logo: this.props.logo ?? undefined,
      location: this.props.location ?? undefined,
    });
  }
}
