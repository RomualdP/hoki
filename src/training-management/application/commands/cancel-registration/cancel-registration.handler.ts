import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ITrainingRegistrationRepository } from '../../../domain/repositories/training-registration.repository.interface';
import { CancelRegistrationCommand } from './cancel-registration.command';

@Injectable()
export class CancelRegistrationHandler {
  constructor(
    private readonly registrationRepository: ITrainingRegistrationRepository,
  ) {}

  async execute(command: CancelRegistrationCommand): Promise<void> {
    const registration = await this.registrationRepository.findOne(
      command.trainingId,
      command.userId,
    );

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    if (!registration.canBeCancelled()) {
      throw new BadRequestException('This registration cannot be cancelled');
    }

    await this.registrationRepository.updateStatus(
      registration.id,
      'CANCELLED',
      new Date(),
    );
  }
}
