import { Injectable, NotFoundException } from '@nestjs/common';
import { ITrainingTemplateRepository } from '../../../domain/repositories/training-template.repository.interface';
import { DeleteTrainingTemplateCommand } from './delete-training-template.command';

@Injectable()
export class DeleteTrainingTemplateHandler {
  constructor(
    private readonly templateRepository: ITrainingTemplateRepository,
  ) {}

  async execute(command: DeleteTrainingTemplateCommand): Promise<void> {
    const template = await this.templateRepository.findById(command.id);

    if (!template) {
      throw new NotFoundException(
        `Training template with id ${command.id} not found`,
      );
    }

    await this.templateRepository.delete(command.id);
  }
}
