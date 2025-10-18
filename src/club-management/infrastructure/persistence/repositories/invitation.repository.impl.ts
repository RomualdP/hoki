import { Injectable } from '@nestjs/common';
import type { InvitationType as PrismaInvitationType } from '@prisma/client';
import { IInvitationRepository } from '../../../domain/repositories/invitation.repository';
import { Invitation } from '../../../domain/entities/invitation.entity';
import { InvitationType } from '../../../domain/value-objects/invitation-type.vo';
import { PrismaService } from '../../../../prisma/prisma.service';
import { InvitationMapper } from '../mappers/invitation.mapper';

/**
 * Prisma implementation of IInvitationRepository
 * Handles persistence of Invitation aggregates
 */
@Injectable()
export class InvitationRepositoryImpl implements IInvitationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(invitation: Invitation): Promise<Invitation> {
    const prismaData = InvitationMapper.toPrismaCreate(invitation);

    const savedInvitation = await this.prisma.invitation.create({
      data: prismaData,
    });

    return InvitationMapper.toDomain(savedInvitation);
  }

  async findById(id: string): Promise<Invitation | null> {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
    });

    return invitation ? InvitationMapper.toDomain(invitation) : null;
  }

  async findByToken(token: string): Promise<Invitation | null> {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
    });

    return invitation ? InvitationMapper.toDomain(invitation) : null;
  }

  async findByClubId(clubId: string): Promise<Invitation[]> {
    const invitations = await this.prisma.invitation.findMany({
      where: { clubId },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map((inv) => InvitationMapper.toDomain(inv));
  }

  async update(invitation: Invitation): Promise<Invitation> {
    const prismaData = InvitationMapper.toPrismaUpdate(invitation);

    const updatedInvitation = await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: prismaData,
    });

    return InvitationMapper.toDomain(updatedInvitation);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.invitation.delete({
      where: { id },
    });
  }

  async existsByToken(token: string): Promise<boolean> {
    const count = await this.prisma.invitation.count({
      where: { token },
    });

    return count > 0;
  }

  async findByCreatorId(creatorId: string): Promise<Invitation[]> {
    const invitations = await this.prisma.invitation.findMany({
      where: { createdBy: creatorId },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map((inv) => InvitationMapper.toDomain(inv));
  }

  async findByType(type: InvitationType): Promise<Invitation[]> {
    const invitations = await this.prisma.invitation.findMany({
      where: { type: type as PrismaInvitationType },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map((inv) => InvitationMapper.toDomain(inv));
  }

  async findValidByClubId(clubId: string): Promise<Invitation[]> {
    const now = new Date();

    const invitations = await this.prisma.invitation.findMany({
      where: {
        clubId,
        expiresAt: { gt: now },
        usedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map((inv) => InvitationMapper.toDomain(inv));
  }

  async findExpired(): Promise<Invitation[]> {
    const now = new Date();

    const invitations = await this.prisma.invitation.findMany({
      where: {
        expiresAt: { lte: now },
        usedAt: null,
      },
      orderBy: { expiresAt: 'desc' },
    });

    return invitations.map((inv) => InvitationMapper.toDomain(inv));
  }

  async findUsed(): Promise<Invitation[]> {
    const invitations = await this.prisma.invitation.findMany({
      where: {
        usedAt: { not: null },
      },
      orderBy: { usedAt: 'desc' },
    });

    return invitations.map((inv) => InvitationMapper.toDomain(inv));
  }

  async findUsedByUserId(userId: string): Promise<Invitation[]> {
    const invitations = await this.prisma.invitation.findMany({
      where: { usedBy: userId },
      orderBy: { usedAt: 'desc' },
    });

    return invitations.map((inv) => InvitationMapper.toDomain(inv));
  }

  async deleteExpired(): Promise<number> {
    const now = new Date();

    const result = await this.prisma.invitation.deleteMany({
      where: {
        expiresAt: { lte: now },
        usedAt: null,
      },
    });

    return result.count;
  }

  async countByClubId(clubId: string): Promise<number> {
    return this.prisma.invitation.count({
      where: { clubId },
    });
  }

  async countValidByClubId(clubId: string): Promise<number> {
    const now = new Date();

    return this.prisma.invitation.count({
      where: {
        clubId,
        expiresAt: { gt: now },
        usedAt: null,
      },
    });
  }
}
