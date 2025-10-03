import { Injectable } from '@nestjs/common';
import {
  ITrainingRepository,
  FindAllTrainingsResult,
} from '../../../domain/repositories/training.repository.interface';
import { ListTrainingsDto } from './list-trainings.dto';

@Injectable()
export class ListTrainingsUseCase {
  constructor(private readonly trainingRepository: ITrainingRepository) {}

  async execute(dto: ListTrainingsDto): Promise<FindAllTrainingsResult> {
    const trainings = await this.trainingRepository.findAll({
      page: dto.page,
      limit: dto.limit,
      status: dto.status,
      dateFrom: dto.dateFrom ? new Date(dto.dateFrom) : undefined,
      dateTo: dto.dateTo ? new Date(dto.dateTo) : undefined,
    });

    return trainings;
  }
}
