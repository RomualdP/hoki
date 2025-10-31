import type {
  Member as PrismaMember,
  ClubRole as PrismaClubRole,
} from '@prisma/client';
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
      role: prismaMember.role as ClubRole,
      joinedAt: prismaMember.joinedAt,
      leftAt: prismaMember.leftAt,
      invitedBy: prismaMember.invitedBy,
      createdAt: prismaMember.createdAt,
      updatedAt: prismaMember.updatedAt,
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
      role: member.role,
      joinedAt: member.joinedAt,
      leftAt: member.leftAt,
      invitedBy: member.invitedBy,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }

  /**
   * Convert Domain Member entity to Prisma create data
   */
  static toPrismaCreate(member: Member): {
    id: string;
    userId: string;
    clubId: string;
    role: PrismaClubRole;
    joinedAt: Date;
    leftAt: Date | null;
    invitedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: member.id,
      userId: member.userId,
      clubId: member.clubId,
      role: member.role as PrismaClubRole,
      joinedAt: member.joinedAt,
      leftAt: member.leftAt,
      invitedBy: member.invitedBy,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }

  /**
   * Convert Domain Member entity to Prisma update data
   */
  static toPrismaUpdate(member: Member): {
    role: PrismaClubRole;
    leftAt: Date | null;
    updatedAt: Date;
  } {
    return {
      role: member.role as PrismaClubRole,
      leftAt: member.leftAt,
      updatedAt: member.updatedAt,
    };
  }
}
