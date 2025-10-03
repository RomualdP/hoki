import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { TrainingController } from './presentation/training.controller';
import { TrainingRegistrationController } from './presentation/training-registration.controller';

import { CreateTrainingUseCase } from './application/use-cases/create-training/create-training.use-case';
import { RegisterToTrainingUseCase } from './application/use-cases/register-to-training/register-to-training.use-case';
import { CancelRegistrationUseCase } from './application/use-cases/cancel-registration/cancel-registration.use-case';
import { ListTrainingsUseCase } from './application/use-cases/list-trainings/list-trainings.use-case';

import { TrainingRepository } from './infrastructure/persistence/repositories/training.repository';
import { TrainingRegistrationRepository } from './infrastructure/persistence/repositories/training-registration.repository';

import { ITrainingRepository } from './domain/repositories/training.repository.interface';
import { ITrainingRegistrationRepository } from './domain/repositories/training-registration.repository.interface';

const TRAINING_REPOSITORY = 'ITrainingRepository';
const TRAINING_REGISTRATION_REPOSITORY = 'ITrainingRegistrationRepository';

@Module({
  imports: [DatabaseModule],
  controllers: [TrainingController, TrainingRegistrationController],
  providers: [
    {
      provide: TRAINING_REPOSITORY,
      useClass: TrainingRepository,
    },
    {
      provide: TRAINING_REGISTRATION_REPOSITORY,
      useClass: TrainingRegistrationRepository,
    },
    {
      provide: CreateTrainingUseCase,
      useFactory: (trainingRepository: ITrainingRepository) => {
        return new CreateTrainingUseCase(trainingRepository);
      },
      inject: [TRAINING_REPOSITORY],
    },
    {
      provide: RegisterToTrainingUseCase,
      useFactory: (
        trainingRepository: ITrainingRepository,
        registrationRepository: ITrainingRegistrationRepository,
      ) => {
        return new RegisterToTrainingUseCase(
          trainingRepository,
          registrationRepository,
        );
      },
      inject: [TRAINING_REPOSITORY, TRAINING_REGISTRATION_REPOSITORY],
    },
    {
      provide: CancelRegistrationUseCase,
      useFactory: (registrationRepository: ITrainingRegistrationRepository) => {
        return new CancelRegistrationUseCase(registrationRepository);
      },
      inject: [TRAINING_REGISTRATION_REPOSITORY],
    },
    {
      provide: ListTrainingsUseCase,
      useFactory: (trainingRepository: ITrainingRepository) => {
        return new ListTrainingsUseCase(trainingRepository);
      },
      inject: [TRAINING_REPOSITORY],
    },
  ],
})
export class TrainingManagementModule {}
