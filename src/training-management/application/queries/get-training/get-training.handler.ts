import { Injectable, NotFoundException } from '@nestjs/common';
import { ITrainingRepository } from '../../../domain/repositories/training.repository.interface';
import { GetTrainingQuery } from './get-training.query';
import { TrainingReadModel } from '../../read-models';

@Injectable()
export class GetTrainingHandler {
  constructor(private readonly trainingRepository: ITrainingRepository) {}

  async execute(query: GetTrainingQuery): Promise<TrainingReadModel> {
    const training = await this.trainingRepository.findById(query.id);

    if (!training) {
      throw new NotFoundException(`Training with ID ${query.id} not found`);
    }

    return {
      id: training.id,
      title: training.title,
      description: training.description,
      scheduledAt: training.scheduledAt,
      duration: training.duration,
      location: training.location,
      maxParticipants: training.maxParticipants,
      status: training.status,
      createdAt: training.createdAt,
      updatedAt: training.updatedAt,
    };
  }
}
