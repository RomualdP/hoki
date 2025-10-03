import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RegisterToTrainingUseCase } from './register-to-training.use-case';
import { RegisterToTrainingDto } from './register-to-training.dto';
import { TrainingRepositoryMock } from '../../../tests/mocks/training.repository.mock';
import { TrainingRegistrationRepositoryMock } from '../../../tests/mocks/training-registration.repository.mock';

describe('RegisterToTrainingUseCase', () => {
  let useCase: RegisterToTrainingUseCase;
  let trainingRepository: TrainingRepositoryMock;
  let registrationRepository: TrainingRegistrationRepositoryMock;

  beforeEach(() => {
    trainingRepository = new TrainingRepositoryMock();
    registrationRepository = new TrainingRegistrationRepositoryMock();
    useCase = new RegisterToTrainingUseCase(
      trainingRepository,
      registrationRepository,
    );
  });

  afterEach(() => {
    trainingRepository.reset();
    registrationRepository.reset();
  });

  describe('execute', () => {
    it('should register a user to a training successfully', async () => {
      const training = await trainingRepository.create({
        title: 'Training session',
        description: null,
        scheduledAt: new Date('2025-12-01T18:00:00Z'),
        duration: 120,
        location: null,
        maxParticipants: 20,
        status: 'SCHEDULED',
      });

      const dto: RegisterToTrainingDto = {
        trainingId: training.id,
        userId: 'user-123',
      };

      const result = await useCase.execute(dto);

      expect(result).toBeDefined();
      expect(result.trainingId).toBe(dto.trainingId);
      expect(result.userId).toBe(dto.userId);
      expect(result.status).toBe('CONFIRMED');
    });

    it('should throw NotFoundException when training does not exist', async () => {
      const dto: RegisterToTrainingDto = {
        trainingId: 'non-existent-id',
        userId: 'user-123',
      };

      await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when user is already registered', async () => {
      const training = await trainingRepository.create({
        title: 'Training session',
        description: null,
        scheduledAt: new Date('2025-12-01T18:00:00Z'),
        duration: 120,
        location: null,
        maxParticipants: 20,
        status: 'SCHEDULED',
      });

      await registrationRepository.create({
        trainingId: training.id,
        userId: 'user-123',
        status: 'CONFIRMED',
        cancelledAt: null,
      });

      const dto: RegisterToTrainingDto = {
        trainingId: training.id,
        userId: 'user-123',
      };

      await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
    });

    it('should set status to WAITLIST when training is full', async () => {
      const training = await trainingRepository.create({
        title: 'Training session',
        description: null,
        scheduledAt: new Date('2025-12-01T18:00:00Z'),
        duration: 120,
        location: null,
        maxParticipants: 1,
        status: 'SCHEDULED',
      });

      await registrationRepository.create({
        trainingId: training.id,
        userId: 'user-1',
        status: 'CONFIRMED',
        cancelledAt: null,
      });

      const dto: RegisterToTrainingDto = {
        trainingId: training.id,
        userId: 'user-2',
      };

      const result = await useCase.execute(dto);

      expect(result.status).toBe('WAITLIST');
    });
  });
});
