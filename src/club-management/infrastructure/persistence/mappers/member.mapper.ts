import { Member } from '../../../domain/entities/member.entity';
import { ClubRole } from '../../../domain/value-objects/club-role.vo';

/**
 * Mapper between Prisma Member model and Domain Member entity
 */
export class MemberMapper {
  /**
   * Convert Prisma Member to Domain Member entity
   */
  static toDomain(prismaMember: any): Member {
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
  static toPrisma(member: Member): any {
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
  static toPrismaCreate(member: Member): any {
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
  static toPrismaUpdate(member: Member): any {
    return {
      role: member.role.value,
      isActive: member.isActive,
    };
  }
}
