import { CreateTrainingUseCase } from './create-training.use-case';
import { CreateTrainingDto } from './create-training.dto';
import { TrainingRepositoryMock } from '../../../tests/mocks/training.repository.mock';

describe('CreateTrainingUseCase', () => {
  let useCase: CreateTrainingUseCase;
  let trainingRepository: TrainingRepositoryMock;

  beforeEach(() => {
    trainingRepository = new TrainingRepositoryMock();
    useCase = new CreateTrainingUseCase(trainingRepository);
  });

  afterEach(() => {
    trainingRepository.reset();
  });

  describe('execute', () => {
    it('should create a training with valid data', async () => {
      const dto: CreateTrainingDto = {
        title: 'Training session',
        description: 'Weekly training',
        scheduledAt: new Date('2025-12-01T18:00:00Z').toISOString(),
        duration: 120,
        location: 'Gym A',
        maxParticipants: 20,
      };

      const result = await useCase.execute(dto);

      expect(result).toBeDefined();
      expect(result.title).toBe(dto.title);
      expect(result.description).toBe(dto.description);
      expect(result.duration).toBe(dto.duration);
      expect(result.location).toBe(dto.location);
      expect(result.maxParticipants).toBe(dto.maxParticipants);
      expect(result.status).toBe('SCHEDULED');
    });

    it('should create a training without optional fields', async () => {
      const dto: CreateTrainingDto = {
        title: 'Training session',
        scheduledAt: new Date('2025-12-01T18:00:00Z').toISOString(),
        duration: 90,
      };

      const result = await useCase.execute(dto);

      expect(result).toBeDefined();
      expect(result.title).toBe(dto.title);
      expect(result.description).toBeNull();
      expect(result.location).toBeNull();
      expect(result.maxParticipants).toBeNull();
      expect(result.status).toBe('SCHEDULED');
    });
  });
});
