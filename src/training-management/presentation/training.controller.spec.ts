import { Test, TestingModule } from '@nestjs/testing';
import { TrainingController } from './training.controller';
import { CreateTrainingUseCase } from '../application/use-cases/create-training/create-training.use-case';
import { ListTrainingsUseCase } from '../application/use-cases/list-trainings/list-trainings.use-case';
import { CreateTrainingDto } from '../application/use-cases/create-training/create-training.dto';
import { ListTrainingsDto } from '../application/use-cases/list-trainings/list-trainings.dto';

describe('TrainingController', () => {
  let controller: TrainingController;
  let createTrainingUseCase: CreateTrainingUseCase;
  let listTrainingsUseCase: ListTrainingsUseCase;

  const mockCreateTrainingUseCase = {
    execute: jest.fn(),
  };

  const mockListTrainingsUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingController],
      providers: [
        {
          provide: CreateTrainingUseCase,
          useValue: mockCreateTrainingUseCase,
        },
        {
          provide: ListTrainingsUseCase,
          useValue: mockListTrainingsUseCase,
        },
      ],
    }).compile();

    controller = module.get<TrainingController>(TrainingController);
    createTrainingUseCase = module.get<CreateTrainingUseCase>(
      CreateTrainingUseCase,
    );
    listTrainingsUseCase =
      module.get<ListTrainingsUseCase>(ListTrainingsUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call CreateTrainingUseCase with correct parameters', async () => {
      const dto: CreateTrainingDto = {
        title: 'Training session',
        description: 'Weekly training',
        scheduledAt: new Date('2025-12-01T18:00:00Z').toISOString(),
        duration: 120,
        location: 'Gym A',
        maxParticipants: 20,
      };

      const mockResult = {
        id: 'training-123',
        ...dto,
        status: 'SCHEDULED',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreateTrainingUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.create(dto);

      expect(createTrainingUseCase.execute).toHaveBeenCalledWith(dto);
      expect(createTrainingUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should call ListTrainingsUseCase with query parameters', async () => {
      const query: ListTrainingsDto = {
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

      mockListTrainingsUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.findAll(query);

      expect(listTrainingsUseCase.execute).toHaveBeenCalledWith(query);
      expect(listTrainingsUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });
  });
});
