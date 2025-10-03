import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTeamDto, UpdateTeamDto, QueryTeamsDto } from './dto';

@Injectable()
export class TeamsService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(query: QueryTeamsDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [teams, total] = await Promise.all([
      this.database.team.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          members: {
            include: { user: true },
          },
          _count: {
            select: {
              members: true,
              homeMatches: true,
              awayMatches: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.database.team.count({ where }),
    ]);

    return {
      data: teams,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findOne(id: string) {
    const team = await this.database.team.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: true },
        },
        homeMatches: {
          include: { awayTeam: true },
          orderBy: { scheduledAt: 'desc' },
          take: 5,
        },
        awayMatches: {
          include: { homeTeam: true },
          orderBy: { scheduledAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async create(createTeamDto: CreateTeamDto) {
    return this.database.team.create({
      data: createTeamDto,
      include: {
        members: {
          include: { user: true },
        },
      },
    });
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const team = await this.database.team.findUnique({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return this.database.team.update({
      where: { id },
      data: updateTeamDto,
      include: {
        members: {
          include: { user: true },
        },
      },
    });
  }

  async remove(id: string) {
    const team = await this.database.team.findUnique({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return this.database.team.delete({ where: { id } });
  }
}
