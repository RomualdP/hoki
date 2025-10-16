import { Test, TestingModule } from '@nestjs/testing';
import { TrainingController } from './training.controller';
import { CreateTrainingHandler } from '../application/commands/create-training/create-training.handler';
import { GenerateTrainingTeamsHandler } from '../application/commands/generate-training-teams/generate-training-teams.handler';
import { DeleteTrainingHandler } from '../application/commands/delete-training/delete-training.handler';
import { RegisterToTrainingHandler } from '../application/commands/register-to-training/register-to-training.handler';
import { ListTrainingsHandler } from '../application/queries/list-trainings/list-trainings.handler';
import { GetTrainingHandler } from '../application/queries/get-training/get-training.handler';
import { GetTrainingTeamsHandler } from '../application/queries/get-training-teams/get-training-teams.handler';
import { GetTrainingRegistrationsHandler } from '../application/queries/get-training-registrations/get-training-registrations.handler';
import { CreateTrainingCommand } from '../application/commands/create-training/create-training.command';
import { ListTrainingsQuery } from '../application/queries/list-trainings/list-trainings.query';

describe('TrainingController', () => {
  let controller: TrainingController;

  const mockCreateTrainingHandler = {
    execute: jest.fn(),
  };

  const mockGenerateTeamsHandler = {
    execute: jest.fn(),
  };

  const mockDeleteTrainingHandler = {
    execute: jest.fn(),
  };

  const mockListTrainingsHandler = {
    execute: jest.fn(),
  };

  const mockGetTrainingHandler = {
    execute: jest.fn(),
  };

  const mockGetTeamsHandler = {
    execute: jest.fn(),
  };

  const mockRegisterToTrainingHandler = {
    execute: jest.fn(),
  };

  const mockGetRegistrationsHandler = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingController],
      providers: [
        {
          provide: CreateTrainingHandler,
          useValue: mockCreateTrainingHandler,
        },
        {
          provide: GenerateTrainingTeamsHandler,
          useValue: mockGenerateTeamsHandler,
        },
        {
          provide: DeleteTrainingHandler,
          useValue: mockDeleteTrainingHandler,
        },
        {
          provide: RegisterToTrainingHandler,
          useValue: mockRegisterToTrainingHandler,
        },
        {
          provide: ListTrainingsHandler,
          useValue: mockListTrainingsHandler,
        },
        {
          provide: GetTrainingHandler,
          useValue: mockGetTrainingHandler,
        },
        {
          provide: GetTrainingTeamsHandler,
          useValue: mockGetTeamsHandler,
        },
        {
          provide: GetTrainingRegistrationsHandler,
          useValue: mockGetRegistrationsHandler,
        },
      ],
    }).compile();

    controller = module.get<TrainingController>(TrainingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call CreateTrainingHandler and return training ID', async () => {
      const command: CreateTrainingCommand = {
        title: 'Training session',
        description: 'Weekly training',
        scheduledAt: new Date('2025-12-01T18:00:00Z').toISOString(),
        duration: 120,
        location: 'Gym A',
        maxParticipants: 20,
      };

      const mockTrainingId = 'training-123';
      mockCreateTrainingHandler.execute.mockResolvedValue(mockTrainingId);

      const result = await controller.create(command);

      expect(mockCreateTrainingHandler.execute).toHaveBeenCalledWith(command);
      expect(mockCreateTrainingHandler.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: mockTrainingId });
    });
  });

  describe('findAll', () => {
    it('should call ListTrainingsHandler with query parameters', async () => {
      const query: ListTrainingsQuery = {
        page: 1,
        limit: 10,
        status: 'SCHEDULED',
      };

      const mockResult = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };

      mockListTrainingsHandler.execute.mockResolvedValue(mockResult);

      const result = await controller.findAll(query);

      expect(mockListTrainingsHandler.execute).toHaveBeenCalledWith(query);
      expect(mockListTrainingsHandler.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });
  });
});
