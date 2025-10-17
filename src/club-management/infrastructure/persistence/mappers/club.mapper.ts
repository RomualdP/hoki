import { Club } from '../../../domain/entities/club.entity';

/**
 * Mapper between Prisma Club model and Domain Club entity
 * Handles conversion in both directions (Prisma ↔ Domain)
 */
export class ClubMapper {
  /**
   * Convert Prisma Club to Domain Club entity
   * Uses reconstitute() factory method to create entity from persisted data
   */
  static toDomain(prismaClub: any): Club {
    return Club.reconstitute({
      id: prismaClub.id,
      name: prismaClub.name,
      description: prismaClub.description,
      logo: prismaClub.logo,
      location: prismaClub.location,
      ownerId: prismaClub.ownerId,
      createdAt: prismaClub.createdAt,
      updatedAt: prismaClub.updatedAt,
    });
  }

  /**
   * Convert Domain Club entity to Prisma Club data
   * Used for create/update operations
   */
  static toPrisma(club: Club): any {
    return {
      id: club.id,
      name: club.name,
      description: club.description,
      logo: club.logo,
      location: club.location,
      ownerId: club.ownerId,
      createdAt: club.createdAt,
      updatedAt: club.updatedAt,
    };
  }

  /**
   * Convert Domain Club entity to Prisma create data
   * Excludes id and timestamps (handled by Prisma)
   */
  static toPrismaCreate(club: Club): any {
    return {
      id: club.id,
      name: club.name,
      description: club.description,
      logo: club.logo,
      location: club.location,
      ownerId: club.ownerId,
    };
  }

  /**
   * Convert Domain Club entity to Prisma update data
   * Only includes updatable fields
   */
  static toPrismaUpdate(club: Club): any {
    return {
      name: club.name,
      description: club.description,
      logo: club.logo,
      location: club.location,
      updatedAt: new Date(),
    };
  }
}
