import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateActivityDto, QueryActivitiesDto } from './dto';
import { ActivityTargetType } from '@prisma/client';
import { ActivityAction } from '@prisma/client';

@Injectable()
export class ActivitiesService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(query: QueryActivitiesDto) {
    const { page = 1, limit = 20, type, targetType, isPublic } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {};

    if (type) where.type = type;
    if (targetType) where.targetType = targetType;
    if (isPublic !== undefined) where.isPublic = isPublic === 'true';

    const [activities, total] = await Promise.all([
      this.database.activity.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          actor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.database.activity.count({ where }),
    ]);

    return {
      data: activities,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findByUser(userId: string, query: Record<string, unknown>) {
    const { page = 1, limit = 20, type, targetType } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {
      actorId: userId,
    };

    if (type) where.type = type;
    if (targetType) where.targetType = targetType;

    const [activities, total] = await Promise.all([
      this.database.activity.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          actor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.database.activity.count({ where }),
    ]);

    return {
      data: activities,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findByTeam(teamId: string, query: Record<string, unknown>) {
    const { page = 1, limit = 20, type } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {
      targetType: 'TEAM',
      targetId: teamId,
    };

    if (type) where.type = type;

    const [activities, total] = await Promise.all([
      this.database.activity.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          actor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.database.activity.count({ where }),
    ]);

    return {
      data: activities,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async create(createActivityDto: CreateActivityDto) {
    return this.database.activity.create({
      data: {
        type: createActivityDto.type,
        actorId: createActivityDto.actorId,
        targetType: createActivityDto.targetType as ActivityTargetType,
        targetId: createActivityDto.targetId,
        action: createActivityDto.action as ActivityAction,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        metadata: (createActivityDto.metadata || {}) as any,
        isPublic: createActivityDto.isPublic ?? true,
      },
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const activity = await this.database.activity.findUnique({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    return this.database.activity.delete({ where: { id } });
  }
}
