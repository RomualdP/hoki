import { Injectable } from '@nestjs/common';
import { IInvitationRepository } from '../../../domain/repositories/invitation.repository';
import { Invitation } from '../../../domain/entities/invitation.entity';
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
}
