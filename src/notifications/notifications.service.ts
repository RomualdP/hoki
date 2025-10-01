import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly database: DatabaseService) {}

  async findByUser(userId: string, query: Record<string, unknown>) {
    const { page = 1, limit = 20, isRead, type } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {
      userId,
    };

    if (isRead !== undefined) where.isRead = isRead === 'true';
    if (type) where.type = type;

    const [notifications, total] = await Promise.all([
      this.database.notification.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      this.database.notification.count({ where }),
    ]);

    return {
      data: notifications,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async markAsRead(id: string) {
    const notification = await this.database.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.database.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.database.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async create(createNotificationDto: CreateNotificationDto) {
    return this.database.notification.create({
      data: createNotificationDto,
    });
  }

  async remove(id: string) {
    const notification = await this.database.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.database.notification.delete({ where: { id } });
  }
}
