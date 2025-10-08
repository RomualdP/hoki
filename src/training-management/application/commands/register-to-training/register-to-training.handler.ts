import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ITrainingRepository } from '../../../domain/repositories/training.repository.interface';
import { ITrainingRegistrationRepository } from '../../../domain/repositories/training-registration.repository.interface';
import { RegisterToTrainingCommand } from './register-to-training.command';

@Injectable()
export class RegisterToTrainingHandler {
  constructor(
    private readonly trainingRepository: ITrainingRepository,
    private readonly registrationRepository: ITrainingRegistrationRepository,
  ) {}

  async execute(command: RegisterToTrainingCommand): Promise<string> {
    const training = await this.trainingRepository.findById(command.trainingId);

    if (!training) {
      throw new NotFoundException(
        `Training with ID ${command.trainingId} not found`,
      );
    }

    if (!training.canAcceptRegistrations()) {
      throw new BadRequestException(
        'This training is not accepting registrations',
      );
    }

    const existingRegistration =
      await this.registrationRepository.existsActiveRegistration(
        command.trainingId,
        command.userId,
      );

    if (existingRegistration) {
      throw new BadRequestException(
        'User is already registered to this training',
      );
    }

    const currentParticipantsCount =
      await this.registrationRepository.countByTrainingId(command.trainingId);

    const hasAvailableSpots = training.hasAvailableSpots(
      currentParticipantsCount,
    );

    const registrationStatus = hasAvailableSpots ? 'CONFIRMED' : 'WAITLIST';

    const registration = await this.registrationRepository.create({
      trainingId: command.trainingId,
      userId: command.userId,
      status: registrationStatus,
      cancelledAt: null,
    });

    return registration.id;
  }
}
