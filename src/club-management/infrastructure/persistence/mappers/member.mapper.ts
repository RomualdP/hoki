/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/unbound-method */
import type { Member as PrismaMember } from '@prisma/client';
import { Member } from '../../../domain/entities/member.entity';
import { ClubRole } from '../../../domain/value-objects/club-role.vo';

/**
 * Mapper between Prisma Member model and Domain Member entity
 */
export class MemberMapper {
  /**
   * Convert Prisma Member to Domain Member entity
   */
  static toDomain(prismaMember: PrismaMember): Member {
    return Member.reconstitute({
      id: prismaMember.id,
      userId: prismaMember.userId,
      clubId: prismaMember.clubId,
      role: ClubRole.fromString(prismaMember.role),
      joinedAt: prismaMember.joinedAt,
      isActive: prismaMember.isActive,
    });
  }

  /**
   * Convert Domain Member entity to Prisma data
   */
  static toPrisma(member: Member): PrismaMember {
    return {
      id: member.id,
      userId: member.userId,
      clubId: member.clubId,
      role: member.role.value,
      joinedAt: member.joinedAt,
      isActive: member.isActive,
    };
  }

  /**
   * Convert Domain Member entity to Prisma create data
   */
  static toPrismaCreate(member: Member): {
    id: string;
    userId: string;
    clubId: string;
    role: string;
    joinedAt: Date;
    isActive: boolean;
  } {
    return {
      id: member.id,
      userId: member.userId,
      clubId: member.clubId,
      role: member.role.value,
      joinedAt: member.joinedAt,
      isActive: member.isActive,
    };
  }

  /**
   * Convert Domain Member entity to Prisma update data
   */
  static toPrismaUpdate(member: Member): {
    role: string;
    isActive: boolean;
  } {
    return {
      role: member.role.value,
      isActive: member.isActive,
    };
  }
}
