import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  CreateTournamentDto,
  UpdateTournamentDto,
} from './dto/create-tournament.dto';

@Injectable()
export class TournamentsService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(query: Record<string, unknown>) {
    const { page = 1, limit = 10, status } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {};

    if (status) where.status = status;

    const [tournaments, total] = await Promise.all([
      this.database.tournament.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          _count: {
            select: {
              teams: true,
            },
          },
        },
        orderBy: { startDate: 'desc' },
      }),
      this.database.tournament.count({ where }),
    ]);

    return {
      data: tournaments,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findOne(id: string) {
    const tournament = await this.database.tournament.findUnique({
      where: { id },
      include: {
        teams: {
          include: { team: true },
        },
      },
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return tournament;
  }

  async addTeam(tournamentId: string, teamId: string) {
    return this.database.tournamentTeam.create({
      data: {
        tournamentId,
        teamId,
      },
      include: { team: true },
    });
  }

  async removeTeam(tournamentId: string, teamId: string) {
    return this.database.tournamentTeam.delete({
      where: {
        tournamentId_teamId: {
          tournamentId,
          teamId,
        },
      },
    });
  }

  async create(createTournamentDto: CreateTournamentDto) {
    return this.database.tournament.create({
      data: createTournamentDto,
    });
  }

  async update(id: string, updateTournamentDto: UpdateTournamentDto) {
    const tournament = await this.database.tournament.findUnique({
      where: { id },
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return this.database.tournament.update({
      where: { id },
      data: updateTournamentDto,
    });
  }

  async remove(id: string) {
    const tournament = await this.database.tournament.findUnique({
      where: { id },
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return this.database.tournament.delete({ where: { id } });
  }
}
