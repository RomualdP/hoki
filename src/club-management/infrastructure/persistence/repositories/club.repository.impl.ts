/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import type { Club as PrismaClub } from '@prisma/client';
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

    const savedClub = (await this.prisma.club.upsert({
      where: { id: club.id },
      create: prismaData,
      update: ClubMapper.toPrismaUpdate(club),
    })) as PrismaClub;

    return ClubMapper.toDomain(savedClub);
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
    const count = (await this.prisma.club.count({
      where: {
        name: {
          equals: name,
          mode: 'insensitive', // Case-insensitive search
        },
      },
    })) as number;

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

  async findAll(filters?: {
    ownerId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Club[]> {
    const clubs = (await this.prisma.club.findMany({
      where: filters?.ownerId ? { ownerId: filters.ownerId } : undefined,
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { createdAt: 'desc' },
    })) as PrismaClub[];

    return clubs.map((club) => ClubMapper.toDomain(club));
  }
}
