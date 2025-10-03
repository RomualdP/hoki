import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ITrainingRepository } from '../../../domain/repositories/training.repository.interface';
import { ITrainingRegistrationRepository } from '../../../domain/repositories/training-registration.repository.interface';
import { TrainingRegistration } from '../../../domain/entities/training-registration.entity';
import { RegisterToTrainingDto } from './register-to-training.dto';

@Injectable()
export class RegisterToTrainingUseCase {
  constructor(
    private readonly trainingRepository: ITrainingRepository,
    private readonly registrationRepository: ITrainingRegistrationRepository,
  ) {}

  async execute(dto: RegisterToTrainingDto): Promise<TrainingRegistration> {
    const training = await this.trainingRepository.findById(dto.trainingId);

    if (!training) {
      throw new NotFoundException(
        `Training with ID ${dto.trainingId} not found`,
      );
    }

    if (!training.canAcceptRegistrations()) {
      throw new BadRequestException(
        'This training is not accepting registrations',
      );
    }

    const existingRegistration =
      await this.registrationRepository.existsActiveRegistration(
        dto.trainingId,
        dto.userId,
      );

    if (existingRegistration) {
      throw new BadRequestException(
        'User is already registered to this training',
      );
    }

    const currentParticipantsCount =
      await this.registrationRepository.countByTrainingId(dto.trainingId);

    const hasAvailableSpots = training.hasAvailableSpots(
      currentParticipantsCount,
    );

    const registrationStatus = hasAvailableSpots ? 'CONFIRMED' : 'WAITLIST';

    const registration = await this.registrationRepository.create({
      trainingId: dto.trainingId,
      userId: dto.userId,
      status: registrationStatus,
      cancelledAt: null,
    });

    return registration;
  }
}
