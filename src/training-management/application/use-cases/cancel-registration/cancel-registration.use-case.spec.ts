import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CancelRegistrationUseCase } from './cancel-registration.use-case';
import { CancelRegistrationDto } from './cancel-registration.dto';
import { TrainingRegistrationRepositoryMock } from '../../../tests/mocks/training-registration.repository.mock';

describe('CancelRegistrationUseCase', () => {
  let useCase: CancelRegistrationUseCase;
  let registrationRepository: TrainingRegistrationRepositoryMock;

  beforeEach(() => {
    registrationRepository = new TrainingRegistrationRepositoryMock();
    useCase = new CancelRegistrationUseCase(registrationRepository);
  });

  afterEach(() => {
    registrationRepository.reset();
  });

  describe('execute', () => {
    it('should cancel a registration successfully', async () => {
      const registration = await registrationRepository.create({
        trainingId: 'training-123',
        userId: 'user-123',
        status: 'CONFIRMED',
        cancelledAt: null,
      });

      const dto: CancelRegistrationDto = {
        trainingId: 'training-123',
        userId: 'user-123',
      };

      const result = await useCase.execute(dto);

      expect(result).toBeDefined();
      expect(result.id).toBe(registration.id);
      expect(result.status).toBe('CANCELLED');
      expect(result.cancelledAt).toBeDefined();
    });

    it('should throw NotFoundException when registration does not exist', async () => {
      const dto: CancelRegistrationDto = {
        trainingId: 'training-123',
        userId: 'user-123',
      };

      await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when registration is already cancelled', async () => {
      await registrationRepository.create({
        trainingId: 'training-123',
        userId: 'user-123',
        status: 'CANCELLED',
        cancelledAt: new Date(),
      });

      const dto: CancelRegistrationDto = {
        trainingId: 'training-123',
        userId: 'user-123',
      };

      await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
