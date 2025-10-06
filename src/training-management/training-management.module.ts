import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';

import { TrainingController } from './presentation/training.controller';
import { TrainingRegistrationController } from './presentation/training-registration.controller';

import { CreateTrainingHandler } from './application/commands/create-training/create-training.handler';
import { RegisterToTrainingHandler } from './application/commands/register-to-training/register-to-training.handler';
import { CancelRegistrationHandler } from './application/commands/cancel-registration/cancel-registration.handler';
import { GenerateTrainingTeamsHandler } from './application/commands/generate-training-teams/generate-training-teams.handler';
import { ListTrainingsHandler } from './application/queries/list-trainings/list-trainings.handler';
import { GetTrainingHandler } from './application/queries/get-training/get-training.handler';
import { GetTrainingTeamsHandler } from './application/queries/get-training-teams/get-training-teams.handler';

import { TrainingRepository } from './infrastructure/persistence/repositories/training.repository';
import { TrainingRegistrationRepository } from './infrastructure/persistence/repositories/training-registration.repository';
import { TrainingTeamRepository } from './infrastructure/persistence/repositories/training-team.repository';

import { ITrainingRepository } from './domain/repositories/training.repository.interface';
import { ITrainingRegistrationRepository } from './domain/repositories/training-registration.repository.interface';
import { ITrainingTeamRepository } from './domain/repositories/training-team.repository.interface';

const TRAINING_REPOSITORY = 'ITrainingRepository';
const TRAINING_REGISTRATION_REPOSITORY = 'ITrainingRegistrationRepository';
const TRAINING_TEAM_REPOSITORY = 'ITrainingTeamRepository';

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
      provide: TRAINING_TEAM_REPOSITORY,
      useClass: TrainingTeamRepository,
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
    {
      provide: GenerateTrainingTeamsHandler,
      useFactory: (
        trainingRepository: ITrainingRepository,
        registrationRepository: ITrainingRegistrationRepository,
        teamRepository: ITrainingTeamRepository,
        db: DatabaseService,
      ) => {
        return new GenerateTrainingTeamsHandler(
          trainingRepository,
          registrationRepository,
          teamRepository,
          db,
        );
      },
      inject: [
        TRAINING_REPOSITORY,
        TRAINING_REGISTRATION_REPOSITORY,
        TRAINING_TEAM_REPOSITORY,
        DatabaseService,
      ],
    },
    {
      provide: GetTrainingTeamsHandler,
      useFactory: (
        teamRepository: ITrainingTeamRepository,
        db: DatabaseService,
      ) => {
        return new GetTrainingTeamsHandler(teamRepository, db);
      },
      inject: [TRAINING_TEAM_REPOSITORY, DatabaseService],
    },
  ],
})
export class TrainingManagementModule {}
