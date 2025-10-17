/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import type { Club as PrismaClub } from '@prisma/client';
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
  static toDomain(prismaClub: PrismaClub): Club {
    const id: string = prismaClub.id;
    const name: string = prismaClub.name;
    const description: string | null = prismaClub.description;
    const logo: string | null = prismaClub.logo;
    const location: string | null = prismaClub.location;
    const ownerId: string = prismaClub.ownerId;
    const createdAt: Date = prismaClub.createdAt;
    const updatedAt: Date = prismaClub.updatedAt;

    return Club.reconstitute({
      id,
      name,
      description,
      logo,
      location,
      ownerId,
      createdAt,
      updatedAt,
    });
  }

  /**
   * Convert Domain Club entity to Prisma Club data
   * Used for create/update operations
   */
  static toPrisma(club: Club): PrismaClub {
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
  static toPrismaCreate(club: Club): {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    location: string | null;
    ownerId: string;
  } {
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
  static toPrismaUpdate(club: Club): {
    name: string;
    description: string | null;
    logo: string | null;
    location: string | null;
    updatedAt: Date;
  } {
    return {
      name: club.name,
      description: club.description,
      logo: club.logo,
      location: club.location,
      updatedAt: new Date(),
    };
  }
}
