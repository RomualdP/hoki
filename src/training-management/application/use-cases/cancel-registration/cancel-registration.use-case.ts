import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ITrainingRegistrationRepository } from '../../../domain/repositories/training-registration.repository.interface';
import { TrainingRegistration } from '../../../domain/entities/training-registration.entity';
import { CancelRegistrationDto } from './cancel-registration.dto';

@Injectable()
export class CancelRegistrationUseCase {
  constructor(
    private readonly registrationRepository: ITrainingRegistrationRepository,
  ) {}

  async execute(dto: CancelRegistrationDto): Promise<TrainingRegistration> {
    const registration = await this.registrationRepository.findOne(
      dto.trainingId,
      dto.userId,
    );

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    if (!registration.canBeCancelled()) {
      throw new BadRequestException('This registration cannot be cancelled');
    }

    const cancelledRegistration =
      await this.registrationRepository.updateStatus(
        registration.id,
        'CANCELLED',
        new Date(),
      );

    return cancelledRegistration;
  }
}
