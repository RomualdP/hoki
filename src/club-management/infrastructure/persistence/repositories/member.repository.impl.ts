/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import type { Member as PrismaMember } from '@prisma/client';
import { IMemberRepository } from '../../../domain/repositories/member.repository';
import { Member } from '../../../domain/entities/member.entity';
import { PrismaService } from '../../../../prisma/prisma.service';
import { MemberMapper } from '../mappers/member.mapper';

/**
 * Prisma implementation of IMemberRepository
 * Handles persistence of Member aggregates
 */
@Injectable()
export class MemberRepositoryImpl implements IMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(member: Member): Promise<Member> {
    const prismaData = MemberMapper.toPrismaCreate(member);

    const savedMember = (await this.prisma.member.upsert({
      where: { id: member.id },
      create: prismaData,
      update: MemberMapper.toPrismaUpdate(member),
    })) as PrismaMember;

    return MemberMapper.toDomain(savedMember);
  }

  async findById(id: string): Promise<Member | null> {
    const member = await this.prisma.member.findUnique({
      where: { id },
    });

    return member ? MemberMapper.toDomain(member) : null;
  }

  async findByUserId(userId: string): Promise<Member | null> {
    const member = await this.prisma.member.findFirst({
      where: { userId, isActive: true },
    });

    return member ? MemberMapper.toDomain(member) : null;
  }

  async findByClubId(clubId: string): Promise<Member[]> {
    const members = (await this.prisma.member.findMany({
      where: { clubId, isActive: true },
      orderBy: { joinedAt: 'asc' },
    })) as PrismaMember[];

    return members.map((member) => MemberMapper.toDomain(member));
  }

  async findByUserIdAndClubId(
    userId: string,
    clubId: string,
  ): Promise<Member | null> {
    const member = await this.prisma.member.findFirst({
      where: { userId, clubId, isActive: true },
    });

    return member ? MemberMapper.toDomain(member) : null;
  }

  async existsByUserIdAndClubId(
    userId: string,
    clubId: string,
  ): Promise<boolean> {
    const count = (await this.prisma.member.count({
      where: { userId, clubId, isActive: true },
    })) as number;

    return count > 0;
  }

  async update(member: Member): Promise<Member> {
    const prismaData = MemberMapper.toPrismaUpdate(member);

    const updatedMember = (await this.prisma.member.update({
      where: { id: member.id },
      data: prismaData,
    })) as PrismaMember;

    return MemberMapper.toDomain(updatedMember);
  }

  async delete(id: string): Promise<void> {
    // Soft delete - mark as inactive
    await this.prisma.member.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
