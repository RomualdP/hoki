import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ITrainingTemplateRepository } from '../../domain/repositories/training-template.repository.interface';
import { ITrainingRepository } from '../../domain/repositories/training.repository.interface';

@Injectable()
export class TrainingSchedulerService {
  private readonly logger = new Logger(TrainingSchedulerService.name);

  constructor(
    private readonly templateRepository: ITrainingTemplateRepository,
    private readonly trainingRepository: ITrainingRepository,
  ) {}

  @Cron('0 9 * * 1', {
    name: 'create-weekly-trainings',
    timeZone: 'Europe/Paris',
  })
  async createWeeklyTrainings(): Promise<void> {
    this.logger.log('Starting weekly training creation job...');

    try {
      const activeTemplates =
        await this.templateRepository.findActiveTemplates();

      if (activeTemplates.length === 0) {
        this.logger.log('No active templates found');
        return;
      }

      this.logger.log(
        `Found ${activeTemplates.length} active template(s) to process`,
      );

      const now = new Date();
      const createdTrainings: string[] = [];

      for (const template of activeTemplates) {
        try {
          const scheduledAt = template.calculateNextScheduledDate(now);

          const training = await this.trainingRepository.create({
            title: template.title,
            description: template.description,
            scheduledAt,
            duration: template.duration,
            location: template.location,
            maxParticipants: template.maxParticipants,
            status: 'SCHEDULED',
          });

          createdTrainings.push(training.id);

          this.logger.log(
            `Created training "${template.title}" scheduled for ${scheduledAt.toISOString()}`,
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          const errorStack = error instanceof Error ? error.stack : undefined;
          this.logger.error(
            `Failed to create training from template ${template.id}: ${errorMessage}`,
            errorStack,
          );
        }
      }

      this.logger.log(
        `Weekly training creation job completed. Created ${createdTrainings.length} training(s)`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Weekly training creation job failed: ${errorMessage}`,
        errorStack,
      );
    }
  }

  async createTrainingsManually(clubId?: string): Promise<number> {
    this.logger.log(
      `Manual training creation triggered${clubId ? ` for club ${clubId}` : ''}`,
    );

    const activeTemplates =
      await this.templateRepository.findActiveTemplates(clubId);

    if (activeTemplates.length === 0) {
      this.logger.log('No active templates found');
      return 0;
    }

    const now = new Date();
    let createdCount = 0;

    for (const template of activeTemplates) {
      try {
        const scheduledAt = template.calculateNextScheduledDate(now);

        await this.trainingRepository.create({
          title: template.title,
          description: template.description,
          scheduledAt,
          duration: template.duration,
          location: template.location,
          maxParticipants: template.maxParticipants,
          status: 'SCHEDULED',
        });

        createdCount++;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(
          `Failed to create training from template ${template.id}: ${errorMessage}`,
        );
      }
    }

    this.logger.log(
      `Manual creation completed. Created ${createdCount} training(s)`,
    );
    return createdCount;
  }
}
