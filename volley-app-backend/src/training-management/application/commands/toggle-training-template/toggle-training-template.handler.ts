import { Injectable, NotFoundException } from '@nestjs/common';
import { ITrainingTemplateRepository } from '../../../domain/repositories/training-template.repository.interface';
import { ToggleTrainingTemplateCommand } from './toggle-training-template.command';

@Injectable()
export class ToggleTrainingTemplateHandler {
  constructor(
    private readonly trainingTemplateRepository: ITrainingTemplateRepository,
  ) {}

  async execute(
    command: ToggleTrainingTemplateCommand,
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

    template.toggle();

    await this.trainingTemplateRepository.save(template);
  }
}

