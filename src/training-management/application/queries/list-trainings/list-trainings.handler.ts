import { Injectable } from '@nestjs/common';
import { ITrainingRepository } from '../../../domain/repositories/training.repository.interface';
import { ListTrainingsQuery } from './list-trainings.query';
import { TrainingListReadModel } from '../../read-models';

export interface ListTrainingsResult {
  data: TrainingListReadModel[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class ListTrainingsHandler {
  constructor(private readonly trainingRepository: ITrainingRepository) {}

  async execute(query: ListTrainingsQuery): Promise<ListTrainingsResult> {
    const result = await this.trainingRepository.findAll({
      page: query.page,
      limit: query.limit,
      status: query.status,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    });

    return {
      data: result.data.map((training) => ({
        id: training.id,
        title: training.title,
        description: training.description,
        scheduledAt: training.scheduledAt,
        duration: training.duration,
        location: training.location,
        maxParticipants: training.maxParticipants,
        status: training.status,
      })),
      meta: result.meta,
    };
  }
}
