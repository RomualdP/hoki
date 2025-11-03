import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ITrainingTemplateRepository } from '../../../domain/repositories/training-template.repository.interface';
import { UpdateTrainingTemplateCommand } from './update-training-template.command';

@Injectable()
export class UpdateTrainingTemplateHandler {
  constructor(
    private readonly templateRepository: ITrainingTemplateRepository,
  ) {}

  async execute(command: UpdateTrainingTemplateCommand): Promise<void> {
    const template = await this.templateRepository.findById(command.id);

    if (!template) {
      throw new NotFoundException(
        `Training template with id ${command.id} not found`,
      );
    }

    // If dayOfWeek or time is being updated, check for conflicts
    if (command.dayOfWeek !== undefined || command.time !== undefined) {
      const newDayOfWeek = command.dayOfWeek ?? template.dayOfWeek;
      const newTime = command.time ?? template.time;

      const conflictingTemplate =
        await this.templateRepository.findConflictingTemplate(
          template.clubId,
          newDayOfWeek,
          newTime,
          command.id, // Exclude current template
        );

      if (conflictingTemplate) {
        throw new ConflictException(
          `Un template existe déjà pour ce club le même jour (${this.getDayName(newDayOfWeek)}) à la même heure (${newTime})`,
        );
      }
    }

    template.updateDetails({
      title: command.title,
      description: command.description,
      duration: command.duration,
      location: command.location,
      maxParticipants: command.maxParticipants,
      dayOfWeek: command.dayOfWeek,
      time: command.time,
      teamIds: command.teamIds,
    });

    if (command.isActive !== undefined) {
      if (command.isActive) {
        template.activate();
      } else {
        template.deactivate();
      }
    }

    await this.templateRepository.save(template);
  }

  private getDayName(dayOfWeek: number): string {
    const days = [
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi',
      'dimanche',
    ];
    return days[dayOfWeek] || 'jour inconnu';
  }
}
