import { Injectable, NotFoundException } from '@nestjs/common';
import { ITrainingTemplateRepository } from '../../../domain/repositories/training-template.repository.interface';
import { ToggleTrainingTemplateCommand } from './toggle-training-template.command';

@Injectable()
export class ToggleTrainingTemplateHandler {
  constructor(
    private readonly templateRepository: ITrainingTemplateRepository,
  ) {}

  async execute(command: ToggleTrainingTemplateCommand): Promise<void> {
    const template = await this.templateRepository.findById(command.id);

    if (!template) {
      throw new NotFoundException(
        `Training template with id ${command.id} not found`,
      );
    }

    template.toggle();

    await this.templateRepository.save(template);
  }
}
