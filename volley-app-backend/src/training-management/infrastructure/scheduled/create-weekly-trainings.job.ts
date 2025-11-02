import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from '../../../database/database.service';
import { ITrainingTemplateRepository } from '../../domain/repositories/training-template.repository.interface';
import { ITrainingRepository } from '../../domain/repositories/training.repository.interface';

@Injectable()
export class CreateWeeklyTrainingsJob {
  private readonly logger = new Logger(CreateWeeklyTrainingsJob.name);

  constructor(
    private readonly database: DatabaseService,
    private readonly trainingTemplateRepository: ITrainingTemplateRepository,
    private readonly trainingRepository: ITrainingRepository,
  ) {}

  @Cron('0 9 * * 1') // Every Monday at 9:00 AM
  async handleCron() {
    this.logger.log('Starting weekly training creation job');

    try {
      const allClubs = await this.getAllClubsWithActiveTemplates();

      for (const clubId of allClubs) {
        await this.createTrainingsForClub(clubId);
      }

      this.logger.log('Weekly training creation job completed successfully');
    } catch (error) {
      this.logger.error(
        `Error in weekly training creation job: ${error.message}`,
        error.stack,
      );
    }
  }

  private async getAllClubsWithActiveTemplates(): Promise<string[]> {
    // Get all active training templates and extract unique clubIds
    const templates = await this.database.trainingTemplate.findMany({
      where: { isActive: true },
      select: { clubId: true },
    });

    // Extract unique clubIds
    const uniqueClubIds = Array.from(
      new Set(templates.map((t) => t.clubId as string)),
    );

    return uniqueClubIds;
  }

  private async createTrainingsForClub(clubId: string): Promise<void> {
    const activeTemplates =
      await this.trainingTemplateRepository.findActiveByClubId(clubId);

    const nextWeekDate = this.getNextWeekMonday();

    for (const template of activeTemplates) {
      const scheduledAt = this.calculateScheduledDate(
        nextWeekDate,
        template.dayOfWeek,
        template.time,
      );

      await this.trainingRepository.create({
        title: template.title,
        description: template.description,
        scheduledAt,
        duration: template.duration,
        location: template.location,
        maxParticipants: template.maxParticipants,
        status: 'SCHEDULED',
      });

      this.logger.log(
        `Created training "${template.title}" for club ${clubId} on ${scheduledAt.toISOString()}`,
      );
    }
  }

  private getNextWeekMonday(): Date {
    // This job runs on Monday at 9am, so we want the Monday of the NEXT week
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // If today is Monday, we want next Monday (7 days from now)
    // Otherwise, calculate days until next Monday and add 7 more days
    let daysUntilNextWeekMonday: number;
    if (dayOfWeek === 1) {
      // Today is Monday, next week's Monday is in 7 days
      daysUntilNextWeekMonday = 7;
    } else {
      // Calculate days until next Monday, then add 7 for the week after
      const daysUntilThisMonday = ((8 - dayOfWeek) % 7) || 7;
      daysUntilNextWeekMonday = daysUntilThisMonday + 7;
    }
    
    const nextWeekMonday = new Date(now);
    nextWeekMonday.setDate(now.getDate() + daysUntilNextWeekMonday);
    nextWeekMonday.setHours(0, 0, 0, 0);
    return nextWeekMonday;
  }

  private calculateScheduledDate(
    baseMonday: Date,
    dayOfWeek: number,
    time: string,
  ): Date {
    // dayOfWeek: 0 = Monday, 6 = Sunday
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledDate = new Date(baseMonday);
    scheduledDate.setDate(baseMonday.getDate() + dayOfWeek);
    scheduledDate.setHours(hours, minutes, 0, 0);
    return scheduledDate;
  }
}

