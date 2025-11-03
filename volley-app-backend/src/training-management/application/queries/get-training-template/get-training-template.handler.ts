import { Injectable, NotFoundException } from '@nestjs/common';
import { ITrainingTemplateRepository } from '../../../domain/repositories/training-template.repository.interface';
import { GetTrainingTemplateQuery } from './get-training-template.query';
import { TrainingTemplateReadModel } from '../../read-models/training-template.read-model';

@Injectable()
export class GetTrainingTemplateHandler {
  constructor(
    private readonly templateRepository: ITrainingTemplateRepository,
  ) {}

  async execute(
    query: GetTrainingTemplateQuery,
  ): Promise<TrainingTemplateReadModel> {
    const template = await this.templateRepository.findById(query.id);

    if (!template) {
      throw new NotFoundException(
        `Training template with id ${query.id} not found`,
      );
    }

    return {
      id: template.id,
      clubId: template.clubId,
      title: template.title,
      description: template.description,
      duration: template.duration,
      location: template.location,
      maxParticipants: template.maxParticipants,
      dayOfWeek: template.dayOfWeek,
      time: template.time,
      isActive: template.isActive,
      teamIds: template.teamIds,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }
}
