import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule, UNIT_OF_WORK } from '../database/database.module';

import { TrainingController } from './presentation/training.controller';
import { TrainingRegistrationController } from './presentation/training-registration.controller';
import { TrainingTemplateController } from './presentation/training-template.controller';

import { CreateTrainingHandler } from './application/commands/create-training/create-training.handler';
import { RegisterToTrainingHandler } from './application/commands/register-to-training/register-to-training.handler';
import { CancelRegistrationHandler } from './application/commands/cancel-registration/cancel-registration.handler';
import { GenerateTrainingTeamsHandler } from './application/commands/generate-training-teams/generate-training-teams.handler';
import { DeleteTrainingHandler } from './application/commands/delete-training/delete-training.handler';
import { CreateTrainingTemplateHandler } from './application/commands/create-training-template/create-training-template.handler';
import { UpdateTrainingTemplateHandler } from './application/commands/update-training-template/update-training-template.handler';
import { DeleteTrainingTemplateHandler } from './application/commands/delete-training-template/delete-training-template.handler';
import { ToggleTrainingTemplateHandler } from './application/commands/toggle-training-template/toggle-training-template.handler';
import { ListTrainingsHandler } from './application/queries/list-trainings/list-trainings.handler';
import { GetTrainingHandler } from './application/queries/get-training/get-training.handler';
import { GetTrainingTeamsHandler } from './application/queries/get-training-teams/get-training-teams.handler';
import { GetTrainingRegistrationsHandler } from './application/queries/get-training-registrations/get-training-registrations.handler';
import { ListTrainingTemplatesHandler } from './application/queries/list-training-templates/list-training-templates.handler';
import { GetTrainingTemplateHandler } from './application/queries/get-training-template/get-training-template.handler';

import { TrainingRepository } from './infrastructure/persistence/repositories/training.repository';
import { TrainingRegistrationRepository } from './infrastructure/persistence/repositories/training-registration.repository';
import { TrainingTeamRepository } from './infrastructure/persistence/repositories/training-team.repository';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { TrainingTemplateRepository } from './infrastructure/persistence/repositories/training-template.repository';

import { ITrainingRepository } from './domain/repositories/training.repository.interface';
import { ITrainingRegistrationRepository } from './domain/repositories/training-registration.repository.interface';
import { ITrainingTeamRepository } from './domain/repositories/training-team.repository.interface';
import { IUserRepository } from './domain/repositories/user.repository.interface';
import { ITrainingTemplateRepository } from './domain/repositories/training-template.repository.interface';
import { IUnitOfWork } from '../database/unit-of-work.interface';

import { TrainingSchedulerService } from './infrastructure/scheduled/training-scheduler.service';

const TRAINING_REPOSITORY = 'ITrainingRepository';
const TRAINING_REGISTRATION_REPOSITORY = 'ITrainingRegistrationRepository';
const TRAINING_TEAM_REPOSITORY = 'ITrainingTeamRepository';
const USER_REPOSITORY = 'IUserRepository';
const TRAINING_TEMPLATE_REPOSITORY = 'ITrainingTemplateRepository';

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot()],
  controllers: [
    TrainingController,
    TrainingRegistrationController,
    TrainingTemplateController,
  ],
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
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: TRAINING_TEMPLATE_REPOSITORY,
      useClass: TrainingTemplateRepository,
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
        userRepository: IUserRepository,
        unitOfWork: IUnitOfWork,
      ) => {
        return new GenerateTrainingTeamsHandler(
          trainingRepository,
          registrationRepository,
          teamRepository,
          userRepository,
          unitOfWork,
        );
      },
      inject: [
        TRAINING_REPOSITORY,
        TRAINING_REGISTRATION_REPOSITORY,
        TRAINING_TEAM_REPOSITORY,
        USER_REPOSITORY,
        UNIT_OF_WORK,
      ],
    },
    {
      provide: GetTrainingTeamsHandler,
      useFactory: (
        teamRepository: ITrainingTeamRepository,
        userRepository: IUserRepository,
      ) => {
        return new GetTrainingTeamsHandler(teamRepository, userRepository);
      },
      inject: [TRAINING_TEAM_REPOSITORY, USER_REPOSITORY],
    },
    {
      provide: DeleteTrainingHandler,
      useFactory: (trainingRepository: ITrainingRepository) => {
        return new DeleteTrainingHandler(trainingRepository);
      },
      inject: [TRAINING_REPOSITORY],
    },
    {
      provide: GetTrainingRegistrationsHandler,
      useFactory: (
        registrationRepository: ITrainingRegistrationRepository,
        userRepository: IUserRepository,
      ) => {
        return new GetTrainingRegistrationsHandler(
          registrationRepository,
          userRepository,
        );
      },
      inject: [TRAINING_REGISTRATION_REPOSITORY, USER_REPOSITORY],
    },
    {
      provide: CreateTrainingTemplateHandler,
      useFactory: (templateRepository: ITrainingTemplateRepository) => {
        return new CreateTrainingTemplateHandler(templateRepository);
      },
      inject: [TRAINING_TEMPLATE_REPOSITORY],
    },
    {
      provide: UpdateTrainingTemplateHandler,
      useFactory: (templateRepository: ITrainingTemplateRepository) => {
        return new UpdateTrainingTemplateHandler(templateRepository);
      },
      inject: [TRAINING_TEMPLATE_REPOSITORY],
    },
    {
      provide: DeleteTrainingTemplateHandler,
      useFactory: (templateRepository: ITrainingTemplateRepository) => {
        return new DeleteTrainingTemplateHandler(templateRepository);
      },
      inject: [TRAINING_TEMPLATE_REPOSITORY],
    },
    {
      provide: ToggleTrainingTemplateHandler,
      useFactory: (templateRepository: ITrainingTemplateRepository) => {
        return new ToggleTrainingTemplateHandler(templateRepository);
      },
      inject: [TRAINING_TEMPLATE_REPOSITORY],
    },
    {
      provide: ListTrainingTemplatesHandler,
      useFactory: (templateRepository: ITrainingTemplateRepository) => {
        return new ListTrainingTemplatesHandler(templateRepository);
      },
      inject: [TRAINING_TEMPLATE_REPOSITORY],
    },
    {
      provide: GetTrainingTemplateHandler,
      useFactory: (templateRepository: ITrainingTemplateRepository) => {
        return new GetTrainingTemplateHandler(templateRepository);
      },
      inject: [TRAINING_TEMPLATE_REPOSITORY],
    },
    {
      provide: TrainingSchedulerService,
      useFactory: (
        templateRepository: ITrainingTemplateRepository,
        trainingRepository: ITrainingRepository,
      ) => {
        return new TrainingSchedulerService(
          templateRepository,
          trainingRepository,
        );
      },
      inject: [TRAINING_TEMPLATE_REPOSITORY, TRAINING_REPOSITORY],
    },
  ],
})
export class TrainingManagementModule {}
