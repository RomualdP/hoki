import { Injectable } from '@nestjs/common';
import { ITrainingRepository } from '../../../domain/repositories/training.repository.interface';
import { CreateTrainingCommand } from './create-training.command';

@Injectable()
export class CreateTrainingHandler {
  constructor(private readonly trainingRepository: ITrainingRepository) {}

  async execute(command: CreateTrainingCommand): Promise<string> {
    const training = await this.trainingRepository.create({
      title: command.title,
      description: command.description ?? null,
      scheduledAt: new Date(command.scheduledAt),
      duration: command.duration,
      location: command.location ?? null,
      maxParticipants: command.maxParticipants ?? null,
      status: 'SCHEDULED',
    });

    return training.id;
  }
}
