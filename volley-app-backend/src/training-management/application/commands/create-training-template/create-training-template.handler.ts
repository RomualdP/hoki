import { Injectable, ConflictException } from '@nestjs/common';
import { ITrainingTemplateRepository } from '../../../domain/repositories/training-template.repository.interface';
import { CreateTrainingTemplateCommand } from './create-training-template.command';

@Injectable()
export class CreateTrainingTemplateHandler {
  constructor(
    private readonly templateRepository: ITrainingTemplateRepository,
  ) {}

  async execute(command: CreateTrainingTemplateCommand): Promise<string> {
    // Check for conflicting templates at the same day/time for the same club
    const conflictingTemplate =
      await this.templateRepository.findConflictingTemplate(
        command.clubId,
        command.dayOfWeek,
        command.time,
      );

    if (conflictingTemplate) {
      throw new ConflictException(
        `Un template existe déjà pour ce club le même jour (${this.getDayName(command.dayOfWeek)}) à la même heure (${command.time})`,
      );
    }

    const template = await this.templateRepository.create({
      clubId: command.clubId,
      title: command.title,
      description: command.description ?? null,
      duration: command.duration,
      location: command.location ?? null,
      maxParticipants: command.maxParticipants ?? null,
      dayOfWeek: command.dayOfWeek,
      time: command.time,
      isActive: command.isActive ?? true,
      teamIds: command.teamIds ?? [],
    });

    return template.id;
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
