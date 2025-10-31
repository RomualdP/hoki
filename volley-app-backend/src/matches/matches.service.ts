import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMatchDto, UpdateMatchDto, QueryMatchesDto } from './dto';
import { MatchWhereInput, DateFilter } from '../types';

@Injectable()
export class MatchesService {
  constructor(private readonly database: DatabaseService) {}

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
      this.database.match.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          homeTeam: true,
          awayTeam: true,
        },
        orderBy: { scheduledAt: 'desc' },
      }),
      this.database.match.count({ where }),
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
    const match = await this.database.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return match;
  }

  async create(createMatchDto: CreateMatchDto) {
    return this.database.match.create({
      data: createMatchDto,
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });
  }

  async update(id: string, updateMatchDto: UpdateMatchDto) {
    const match = await this.database.match.findUnique({ where: { id } });
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return this.database.match.update({
      where: { id },
      data: updateMatchDto,
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });
  }

  async remove(id: string) {
    const match = await this.database.match.findUnique({ where: { id } });
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return this.database.match.delete({ where: { id } });
  }
}
