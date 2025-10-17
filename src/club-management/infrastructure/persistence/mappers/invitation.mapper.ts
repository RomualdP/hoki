import { Invitation } from '../../../domain/entities/invitation.entity';
import { InvitationType } from '../../../domain/value-objects/invitation-type.vo';

/**
 * Mapper between Prisma Invitation model and Domain Invitation entity
 */
export class InvitationMapper {
  /**
   * Convert Prisma Invitation to Domain Invitation entity
   */
  static toDomain(prismaInvitation: any): Invitation {
    return Invitation.reconstitute({
      id: prismaInvitation.id,
      token: prismaInvitation.token,
      clubId: prismaInvitation.clubId,
      type: InvitationType.fromString(prismaInvitation.type),
      expiresAt: prismaInvitation.expiresAt,
      createdBy: prismaInvitation.createdBy,
      createdAt: prismaInvitation.createdAt,
      usedAt: prismaInvitation.usedAt,
      usedBy: prismaInvitation.usedBy,
    });
  }

  /**
   * Convert Domain Invitation entity to Prisma data
   */
  static toPrisma(invitation: Invitation): any {
    return {
      id: invitation.id,
      token: invitation.token,
      clubId: invitation.clubId,
      type: invitation.type.value,
      expiresAt: invitation.expiresAt,
      createdBy: invitation.createdBy,
      createdAt: invitation.createdAt,
      usedAt: invitation.usedAt,
      usedBy: invitation.usedBy,
    };
  }

  /**
   * Convert Domain Invitation entity to Prisma create data
   */
  static toPrismaCreate(invitation: Invitation): any {
    return {
      id: invitation.id,
      token: invitation.token,
      clubId: invitation.clubId,
      type: invitation.type.value,
      expiresAt: invitation.expiresAt,
      createdBy: invitation.createdBy,
      createdAt: invitation.createdAt,
    };
  }

  /**
   * Convert Domain Invitation entity to Prisma update data
   * Primarily used for marking as used
   */
  static toPrismaUpdate(invitation: Invitation): any {
    return {
      usedAt: invitation.usedAt,
      usedBy: invitation.usedBy,
    };
  }
}
