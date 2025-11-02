import { Injectable, NotFoundException } from '@nestjs/common';
import { ITrainingTemplateRepository } from '../../../domain/repositories/training-template.repository.interface';
import { DeleteTrainingTemplateCommand } from './delete-training-template.command';

@Injectable()
export class DeleteTrainingTemplateHandler {
  constructor(
    private readonly trainingTemplateRepository: ITrainingTemplateRepository,
  ) {}

  async execute(
    command: DeleteTrainingTemplateCommand,
    clubId: string,
  ): Promise<void> {
    const template = await this.trainingTemplateRepository.findById(
      command.id,
    );

    if (!template) {
      throw new NotFoundException(
        `Training template with ID ${command.id} not found`,
      );
    }

    if (template.clubId !== clubId) {
      throw new NotFoundException(
        `Training template with ID ${command.id} not found`,
      );
    }

    await this.trainingTemplateRepository.delete(command.id);
  }
}

