import { Injectable, NotFoundException } from '@nestjs/common';
import { ITrainingTemplateRepository } from '../../../domain/repositories/training-template.repository.interface';
import { UpdateTrainingTemplateCommand } from './update-training-template.command';

@Injectable()
export class UpdateTrainingTemplateHandler {
  constructor(
    private readonly trainingTemplateRepository: ITrainingTemplateRepository,
  ) {}

  async execute(
    id: string,
    command: UpdateTrainingTemplateCommand,
    clubId: string,
  ): Promise<void> {
    const template = await this.trainingTemplateRepository.findById(id);

    if (!template) {
      throw new NotFoundException(`Training template with ID ${id} not found`);
    }

    if (template.clubId !== clubId) {
      throw new NotFoundException(
        `Training template with ID ${id} not found`,
      );
    }

    template.update({
      title: command.title,
      description: command.description,
      duration: command.duration,
      location: command.location,
      maxParticipants: command.maxParticipants,
      dayOfWeek: command.dayOfWeek,
      time: command.time,
      teamIds: command.teamIds,
    });

    await this.trainingTemplateRepository.save(template);
  }
}

