import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMatchDto,
  UpdateMatchDto,
  QueryMatchesDto,
  CreateMatchEventDto,
  CreateMatchCommentDto,
  CreateMatchParticipantDto,
} from './dto';
import { MatchWhereInput, DateFilter } from '../types';

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryMatchesDto) {
    const { page = 1, limit = 10, status, teamId, dateFrom, dateTo } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: MatchWhereInput = {};

    if (status)
      where.status = status as
        | 'SCHEDULED'
        | 'IN_PROGRESS'
        | 'COMPLETED'
        | 'CANCELLED';
    if (teamId) {
      where.OR = [{ homeTeamId: teamId }, { awayTeamId: teamId }];
    }
    if (dateFrom || dateTo) {
      const dateFilter: DateFilter = {};
      if (dateFrom) dateFilter.gte = new Date(dateFrom);
      if (dateTo) dateFilter.lte = new Date(dateTo);
      where.scheduledAt = dateFilter;
    }

    const [matches, total] = await Promise.all([
      this.prisma.match.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          homeTeam: true,
          awayTeam: true,
          court: true,
          _count: {
            select: {
              participants: true,
              events: true,
              comments: true,
            },
          },
        },
        orderBy: { scheduledAt: 'desc' },
      }),
      this.prisma.match.count({ where }),
    ]);

    return {
      data: matches,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findOne(id: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        court: true,
        sets: true,
        participants: {
          include: { user: true },
        },
        weather: true,
        statistics: {
          include: {
            playerStats: {
              include: { user: true },
            },
          },
        },
        events: {
          include: { user: true },
          orderBy: { timestamp: 'desc' },
        },
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return match;
  }

  async getStatistics(id: string) {
    return this.prisma.matchStatistics.findUnique({
      where: { matchId: id },
      include: {
        playerStats: {
          include: { user: true },
        },
      },
    });
  }

  async getEvents(id: string) {
    return this.prisma.matchEvent.findMany({
      where: { matchId: id },
      include: { user: true },
      orderBy: { timestamp: 'desc' },
    });
  }

  async addEvent(matchId: string, eventData: CreateMatchEventDto) {
    return this.prisma.matchEvent.create({
      data: {
        matchId,
        ...eventData,
      },
      include: { user: true },
    });
  }

  async getComments(id: string) {
    return this.prisma.matchComment.findMany({
      where: { matchId: id },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addComment(matchId: string, commentData: CreateMatchCommentDto) {
    return this.prisma.matchComment.create({
      data: {
        matchId,
        userId: commentData.authorId,
        content: commentData.content,
      },
      include: { user: true },
    });
  }

  async joinMatch(matchId: string, participantData: CreateMatchParticipantDto) {
    return this.prisma.matchParticipant.create({
      data: {
        matchId,
        ...participantData,
      },
      include: { user: true },
    });
  }

  async leaveMatch(matchId: string, userId: string) {
    return this.prisma.matchParticipant.delete({
      where: {
        matchId_userId: {
          matchId,
          userId,
        },
      },
    });
  }

  async startMatch(id: string) {
    return this.prisma.match.update({
      where: { id },
      data: { status: 'IN_PROGRESS' },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });
  }

  async endMatch(id: string, resultData: Record<string, unknown>) {
    return this.prisma.match.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        ...resultData,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        statistics: true,
      },
    });
  }

  async create(createMatchDto: CreateMatchDto) {
    return this.prisma.match.create({
      data: createMatchDto,
      include: {
        homeTeam: true,
        awayTeam: true,
        court: true,
      },
    });
  }

  async update(id: string, updateMatchDto: UpdateMatchDto) {
    const match = await this.prisma.match.findUnique({ where: { id } });
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return this.prisma.match.update({
      where: { id },
      data: updateMatchDto,
      include: {
        homeTeam: true,
        awayTeam: true,
        court: true,
      },
    });
  }

  async remove(id: string) {
    const match = await this.prisma.match.findUnique({ where: { id } });
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return this.prisma.match.delete({ where: { id } });
  }
}
