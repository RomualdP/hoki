import { Injectable } from '@nestjs/common';
import { ITrainingTemplateRepository } from '../../../domain/repositories/training-template.repository.interface';
import { CreateTrainingTemplateCommand } from './create-training-template.command';

@Injectable()
export class CreateTrainingTemplateHandler {
  constructor(
    private readonly trainingTemplateRepository: ITrainingTemplateRepository,
  ) {}

  async execute(
    command: CreateTrainingTemplateCommand,
    clubId: string,
  ): Promise<string> {
    const template = await this.trainingTemplateRepository.create({
      clubId,
      title: command.title,
      description: command.description ?? null,
      duration: command.duration,
      location: command.location ?? null,
      maxParticipants: command.maxParticipants ?? null,
      dayOfWeek: command.dayOfWeek,
      time: command.time,
      teamIds: command.teamIds ?? [],
      isActive: command.isActive ?? true,
    });

    return template.id;
  }
}

