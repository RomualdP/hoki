import { Injectable } from '@nestjs/common';
import type { ClubRole as PrismaClubRole } from '@prisma/client';
import { IMemberRepository } from '../../../domain/repositories/member.repository';
import { Member } from '../../../domain/entities/member.entity';
import { PrismaService } from '../../../../prisma/prisma.service';
import { MemberMapper } from '../mappers/member.mapper';
import { ClubRole } from '../../../domain/value-objects/club-role.vo';

/**
 * Prisma implementation of IMemberRepository
 * Handles persistence of Member aggregates
 */
@Injectable()
export class MemberRepositoryImpl implements IMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(member: Member): Promise<Member> {
    const prismaData = MemberMapper.toPrismaCreate(member);

    const savedMember = await this.prisma.member.upsert({
      where: { id: member.id },
      create: prismaData,
      update: MemberMapper.toPrismaUpdate(member),
    });

    return MemberMapper.toDomain(savedMember);
  }

  async findById(id: string): Promise<Member | null> {
    const member = await this.prisma.member.findUnique({
      where: { id },
    });

    return member ? MemberMapper.toDomain(member) : null;
  }

  async findByUserId(userId: string): Promise<Member[]> {
    const members = await this.prisma.member.findMany({
      where: { userId },
      orderBy: { joinedAt: 'desc' },
    });

    return members.map((member) => MemberMapper.toDomain(member));
  }

  async findByClubId(clubId: string): Promise<Member[]> {
    const members = await this.prisma.member.findMany({
      where: { clubId },
      orderBy: { joinedAt: 'asc' },
    });

    return members.map((member) => MemberMapper.toDomain(member));
  }

  async findByUserIdAndClubId(
    userId: string,
    clubId: string,
  ): Promise<Member | null> {
    const member = await this.prisma.member.findFirst({
      where: {
        userId,
        clubId,
      },
    });

    return member ? MemberMapper.toDomain(member) : null;
  }

  async existsByUserIdAndClubId(
    userId: string,
    clubId: string,
  ): Promise<boolean> {
    const count = await this.prisma.member.count({
      where: {
        userId,
        clubId,
      },
    });

    return count > 0;
  }

  async update(member: Member): Promise<Member> {
    const prismaData = MemberMapper.toPrismaUpdate(member);

    const updatedMember = await this.prisma.member.update({
      where: { id: member.id },
      data: prismaData,
    });

    return MemberMapper.toDomain(updatedMember);
  }

  async delete(id: string): Promise<void> {
    // Soft delete - set leftAt to current date
    await this.prisma.member.update({
      where: { id },
      data: { leftAt: new Date() },
    });
  }

  async findActiveByClubId(clubId: string): Promise<Member[]> {
    const members = await this.prisma.member.findMany({
      where: { clubId, leftAt: null },
      orderBy: { joinedAt: 'asc' },
    });

    return members.map((member) => MemberMapper.toDomain(member));
  }

  async findByClubIdAndRole(clubId: string, role: ClubRole): Promise<Member[]> {
    const members = await this.prisma.member.findMany({
      where: { clubId, role: role as PrismaClubRole },
      orderBy: { joinedAt: 'asc' },
    });

    return members.map((member) => MemberMapper.toDomain(member));
  }

  async findActiveByClubIdAndRole(
    clubId: string,
    role: ClubRole,
  ): Promise<Member[]> {
    const members = await this.prisma.member.findMany({
      where: { clubId, role: role as PrismaClubRole, leftAt: null },
      orderBy: { joinedAt: 'asc' },
    });

    return members.map((member) => MemberMapper.toDomain(member));
  }

  async findActiveByUserId(userId: string): Promise<Member | null> {
    const member = await this.prisma.member.findFirst({
      where: { userId, leftAt: null },
      orderBy: { joinedAt: 'desc' },
    });

    return member ? MemberMapper.toDomain(member) : null;
  }

  async findByInviterId(inviterId: string): Promise<Member[]> {
    const members = await this.prisma.member.findMany({
      where: { invitedBy: inviterId },
      orderBy: { joinedAt: 'desc' },
    });

    return members.map((member) => MemberMapper.toDomain(member));
  }

  async countByClubId(clubId: string): Promise<number> {
    return this.prisma.member.count({
      where: { clubId },
    });
  }

  async countActiveByClubId(clubId: string): Promise<number> {
    return this.prisma.member.count({
      where: { clubId, leftAt: null },
    });
  }

  async countByClubIdAndRole(clubId: string, role: ClubRole): Promise<number> {
    return this.prisma.member.count({
      where: { clubId, role: role as PrismaClubRole },
    });
  }
}
