import type {
  Invitation as PrismaInvitation,
  InvitationType as PrismaInvitationType,
} from '@prisma/client';
import { Invitation } from '../../../domain/entities/invitation.entity';
import { InvitationType } from '../../../domain/value-objects/invitation-type.vo';

/**
 * Mapper between Prisma Invitation model and Domain Invitation entity
 */
export class InvitationMapper {
  /**
   * Convert Prisma Invitation to Domain Invitation entity
   */
  static toDomain(prismaInvitation: PrismaInvitation): Invitation {
    return Invitation.reconstitute({
      id: prismaInvitation.id,
      token: prismaInvitation.token,
      clubId: prismaInvitation.clubId,
      type: prismaInvitation.type as InvitationType,
      expiresAt: prismaInvitation.expiresAt,
      createdBy: prismaInvitation.createdBy,
      createdAt: prismaInvitation.createdAt,
      usedAt: prismaInvitation.usedAt,
      usedBy: prismaInvitation.usedBy,
      updatedAt: prismaInvitation.updatedAt,
    });
  }

  /**
   * Convert Domain Invitation entity to Prisma data
   */
  static toPrisma(invitation: Invitation): PrismaInvitation {
    return {
      id: invitation.id,
      token: invitation.token,
      clubId: invitation.clubId,
      type: invitation.type,
      expiresAt: invitation.expiresAt,
      createdBy: invitation.createdBy,
      createdAt: invitation.createdAt,
      usedAt: invitation.usedAt,
      usedBy: invitation.usedBy,
      updatedAt: invitation.updatedAt,
    };
  }

  /**
   * Convert Domain Invitation entity to Prisma create data
   */
  static toPrismaCreate(invitation: Invitation): {
    id: string;
    token: string;
    clubId: string;
    type: PrismaInvitationType;
    expiresAt: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: invitation.id,
      token: invitation.token,
      clubId: invitation.clubId,
      type: invitation.type as PrismaInvitationType,
      expiresAt: invitation.expiresAt,
      createdBy: invitation.createdBy,
      createdAt: invitation.createdAt,
      updatedAt: invitation.updatedAt,
    };
  }

  /**
   * Convert Domain Invitation entity to Prisma update data
   * Primarily used for marking as used
   */
  static toPrismaUpdate(invitation: Invitation): {
    usedAt: Date | null;
    usedBy: string | null;
    updatedAt: Date;
  } {
    return {
      usedAt: invitation.usedAt,
      usedBy: invitation.usedBy,
      updatedAt: invitation.updatedAt,
    };
  }
}
