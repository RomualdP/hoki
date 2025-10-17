/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import type { Invitation as PrismaInvitation } from '@prisma/client';
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
    const id: string = prismaInvitation.id;
    const token: string = prismaInvitation.token;
    const clubId: string = prismaInvitation.clubId;
    const type = InvitationType.fromString(prismaInvitation.type);
    const expiresAt: Date = prismaInvitation.expiresAt;
    const createdBy: string = prismaInvitation.createdBy;
    const createdAt: Date = prismaInvitation.createdAt;
    const usedAt: Date | null = prismaInvitation.usedAt;
    const usedBy: string | null = prismaInvitation.usedBy;

    return Invitation.reconstitute({
      id,
      token,
      clubId,
      type,
      expiresAt,
      createdBy,
      createdAt,
      usedAt,
      usedBy,
    });
  }

  /**
   * Convert Domain Invitation entity to Prisma data
   */
  static toPrisma(invitation: Invitation): PrismaInvitation {
    const id: string = invitation.id;
    const token: string = invitation.token;
    const clubId: string = invitation.clubId;
    const type: string = invitation.type.value;
    const expiresAt: Date = invitation.expiresAt;
    const createdBy: string = invitation.createdBy;
    const createdAt: Date = invitation.createdAt;
    const usedAt: Date | null = invitation.usedAt;
    const usedBy: string | null = invitation.usedBy;

    return {
      id,
      token,
      clubId,
      type,
      expiresAt,
      createdBy,
      createdAt,
      usedAt,
      usedBy,
    };
  }

  /**
   * Convert Domain Invitation entity to Prisma create data
   */
  static toPrismaCreate(invitation: Invitation): {
    id: string;
    token: string;
    clubId: string;
    type: string;
    expiresAt: Date;
    createdBy: string;
    createdAt: Date;
  } {
    const id: string = invitation.id;
    const token: string = invitation.token;
    const clubId: string = invitation.clubId;
    const type: string = invitation.type.value;
    const expiresAt: Date = invitation.expiresAt;
    const createdBy: string = invitation.createdBy;
    const createdAt: Date = invitation.createdAt;

    return {
      id,
      token,
      clubId,
      type,
      expiresAt,
      createdBy,
      createdAt,
    };
  }

  /**
   * Convert Domain Invitation entity to Prisma update data
   * Primarily used for marking as used
   */
  static toPrismaUpdate(invitation: Invitation): {
    usedAt: Date | null;
    usedBy: string | null;
  } {
    return {
      usedAt: invitation.usedAt,
      usedBy: invitation.usedBy,
    };
  }
}
