import { Injectable } from '@nestjs/common';
import { ITrainingTemplateRepository } from '../../../domain/repositories/training-template.repository.interface';
import { ListTrainingTemplatesQuery } from './list-training-templates.query';
import { TrainingTemplateListReadModel } from '../../read-models/training-template.read-model';

export interface ListTrainingTemplatesResult {
  data: TrainingTemplateListReadModel[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class ListTrainingTemplatesHandler {
  constructor(
    private readonly templateRepository: ITrainingTemplateRepository,
  ) {}

  async execute(
    query: ListTrainingTemplatesQuery,
  ): Promise<ListTrainingTemplatesResult> {
    const result = await this.templateRepository.findAll({
      clubId: query.clubId,
      page: query.page,
      limit: query.limit,
      isActive: query.isActive,
    });

    return {
      data: result.data.map((template) => ({
        id: template.id,
        title: template.title,
        description: template.description,
        duration: template.duration,
        location: template.location,
        maxParticipants: template.maxParticipants,
        dayOfWeek: template.dayOfWeek,
        time: template.time,
        isActive: template.isActive,
        teamIds: template.teamIds,
      })),
      meta: result.meta,
    };
  }
}
