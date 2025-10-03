import { Injectable } from '@nestjs/common';
import { ITrainingRepository } from '../../../domain/repositories/training.repository.interface';
import { Training } from '../../../domain/entities/training.entity';
import { CreateTrainingDto } from './create-training.dto';

@Injectable()
export class CreateTrainingUseCase {
  constructor(private readonly trainingRepository: ITrainingRepository) {}

  async execute(dto: CreateTrainingDto): Promise<Training> {
    const training = await this.trainingRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      scheduledAt: new Date(dto.scheduledAt),
      duration: dto.duration,
      location: dto.location ?? null,
      maxParticipants: dto.maxParticipants ?? null,
      status: 'SCHEDULED',
    });

    return training;
  }
}
