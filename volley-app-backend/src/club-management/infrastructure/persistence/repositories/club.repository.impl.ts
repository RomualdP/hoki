import { Injectable } from '@nestjs/common';
import { IClubRepository } from '../../../domain/repositories/club.repository';
import { Club } from '../../../domain/entities/club.entity';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ClubMapper } from '../mappers/club.mapper';

/**
 * Prisma implementation of IClubRepository
 * Handles persistence of Club aggregates using Prisma ORM
 */
@Injectable()
export class ClubRepositoryImpl implements IClubRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(club: Club): Promise<Club> {
    const prismaData = ClubMapper.toPrismaCreate(club);

    const savedClub = await this.prisma.club.create({
      data: prismaData,
    });

    return ClubMapper.toDomain(savedClub);
  }

  async update(club: Club): Promise<Club> {
    const prismaData = ClubMapper.toPrismaUpdate(club);

    const updatedClub = await this.prisma.club.update({
      where: { id: club.id },
      data: prismaData,
    });

    return ClubMapper.toDomain(updatedClub);
  }

  async findById(id: string): Promise<Club | null> {
    const club = await this.prisma.club.findUnique({
      where: { id },
    });

    return club ? ClubMapper.toDomain(club) : null;
  }

  async findByOwnerId(ownerId: string): Promise<Club | null> {
    const club = await this.prisma.club.findFirst({
      where: { ownerId },
    });

    return club ? ClubMapper.toDomain(club) : null;
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.prisma.club.count({
      where: {
        name: {
          equals: name,
          mode: 'insensitive', // Case-insensitive search
        },
      },
    });

    return count > 0;
  }

  async getAllClubNames(): Promise<string[]> {
    const clubs = (await this.prisma.club.findMany({
      select: { name: true },
    })) as { name: string }[];

    return clubs.map((club) => club.name);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.club.delete({
      where: { id },
    });
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    searchTerm?: string;
  }): Promise<Club[]> {
    const clubs = await this.prisma.club.findMany({
      where: options?.searchTerm
        ? {
            OR: [
              {
                name: {
                  contains: options.searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: options.searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                location: {
                  contains: options.searchTerm,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : undefined,
      take: options?.take,
      skip: options?.skip,
      orderBy: { createdAt: 'desc' },
    });

    return clubs.map((club) => ClubMapper.toDomain(club));
  }

  async count(searchTerm?: string): Promise<number> {
    return this.prisma.club.count({
      where: searchTerm
        ? {
            OR: [
              {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                location: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : undefined,
    });
  }
}
