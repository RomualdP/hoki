import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { TrainingController } from './presentation/training.controller';
import { TrainingRegistrationController } from './presentation/training-registration.controller';

import { CreateTrainingHandler } from './application/commands/create-training/create-training.handler';
import { RegisterToTrainingHandler } from './application/commands/register-to-training/register-to-training.handler';
import { CancelRegistrationHandler } from './application/commands/cancel-registration/cancel-registration.handler';
import { ListTrainingsHandler } from './application/queries/list-trainings/list-trainings.handler';
import { GetTrainingHandler } from './application/queries/get-training/get-training.handler';

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
      provide: CreateTrainingHandler,
      useFactory: (trainingRepository: ITrainingRepository) => {
        return new CreateTrainingHandler(trainingRepository);
      },
      inject: [TRAINING_REPOSITORY],
    },
    {
      provide: RegisterToTrainingHandler,
      useFactory: (
        trainingRepository: ITrainingRepository,
        registrationRepository: ITrainingRegistrationRepository,
      ) => {
        return new RegisterToTrainingHandler(
          trainingRepository,
          registrationRepository,
        );
      },
      inject: [TRAINING_REPOSITORY, TRAINING_REGISTRATION_REPOSITORY],
    },
    {
      provide: CancelRegistrationHandler,
      useFactory: (registrationRepository: ITrainingRegistrationRepository) => {
        return new CancelRegistrationHandler(registrationRepository);
      },
      inject: [TRAINING_REGISTRATION_REPOSITORY],
    },
    {
      provide: ListTrainingsHandler,
      useFactory: (trainingRepository: ITrainingRepository) => {
        return new ListTrainingsHandler(trainingRepository);
      },
      inject: [TRAINING_REPOSITORY],
    },
    {
      provide: GetTrainingHandler,
      useFactory: (trainingRepository: ITrainingRepository) => {
        return new GetTrainingHandler(trainingRepository);
      },
      inject: [TRAINING_REPOSITORY],
    },
  ],
})
export class TrainingManagementModule {}
