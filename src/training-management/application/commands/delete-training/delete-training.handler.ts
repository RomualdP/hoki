import { Injectable, NotFoundException } from '@nestjs/common';
import { ITrainingRepository } from '../../../domain/repositories/training.repository.interface';
import { DeleteTrainingCommand } from './delete-training.command';

@Injectable()
export class DeleteTrainingHandler {
  constructor(private readonly trainingRepository: ITrainingRepository) {}

  async execute(command: DeleteTrainingCommand): Promise<void> {
    const training = await this.trainingRepository.findById(command.id);

    if (!training) {
      throw new NotFoundException(
        `Entraînement avec l'ID ${command.id} non trouvé`,
      );
    }

    await this.trainingRepository.delete(command.id);
  }
}
