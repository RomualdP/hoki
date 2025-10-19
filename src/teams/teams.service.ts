/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DatabaseService } from '../database/database.service';
import {
  CreateTeamDto,
  UpdateTeamDto,
  QueryTeamsDto,
  AddTeamMemberDto,
} from './dto';
import { GetSubscriptionQuery } from '../club-management/application/queries/get-subscription/get-subscription.query';

@Injectable()
export class TeamsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly queryBus: QueryBus,
  ) {}

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

  async create(createTeamDto: CreateTeamDto, userId: string) {
    // Get user to check their club and role
    const user = await this.database.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.clubId) {
      throw new ForbiddenException(
        'You must be part of a club to create a team',
      );
    }

    if (user.clubRole !== 'COACH') {
      throw new ForbiddenException('Only coaches can create teams');
    }

    // Check subscription limits using the club-management bounded context
    const subscriptionResult = await this.queryBus.execute(
      new GetSubscriptionQuery(user.clubId),
    );

    if (!subscriptionResult.canCreateTeam) {
      throw new ForbiddenException(
        `Team limit reached. Current plan allows ${subscriptionResult.maxTeams} team(s). Please upgrade your subscription.`,
      );
    }

    // Create team linked to the club
    return this.database.team.create({
      data: {
        ...createTeamDto,
        clubId: user.clubId,
      },
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

  /**
   * Add a member to a team
   * Only players from the same club can be added
   */
  async addMember(
    teamId: string,
    userId: string,
    memberData: AddTeamMemberDto,
  ) {
    // Verify team exists and get its clubId
    const team = await this.database.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    if (!team.clubId) {
      throw new BadRequestException('This team is not linked to a club');
    }

    // Verify user exists and is in the same club
    const memberUser = await this.database.user.findUnique({
      where: { id: memberData.userId },
    });

    if (!memberUser) {
      throw new NotFoundException(
        `User with ID ${memberData.userId} not found`,
      );
    }

    if (memberUser.clubId !== team.clubId) {
      throw new ForbiddenException(
        'User must be a member of the same club as the team',
      );
    }

    // Check if user is already a member
    const existingMembership = await this.database.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: memberData.userId,
          teamId,
        },
      },
    });

    if (existingMembership) {
      throw new BadRequestException('User is already a member of this team');
    }

    // Add member
    return this.database.teamMember.create({
      data: {
        userId: memberData.userId,
        teamId,
        role: memberData.role,
        joinedAt: memberData.joinedAt || new Date(),
      },
      include: {
        user: true,
        team: true,
      },
    });
  }

  /**
   * Remove a member from a team
   */
  async removeMember(teamId: string, userId: string, memberId: string) {
    // Verify team exists
    const team = await this.database.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    // Verify membership exists
    const membership = await this.database.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: memberId,
          teamId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException(
        `Member with ID ${memberId} not found in this team`,
      );
    }

    // Remove member
    return this.database.teamMember.delete({
      where: {
        userId_teamId: {
          userId: memberId,
          teamId,
        },
      },
    });
  }
}
