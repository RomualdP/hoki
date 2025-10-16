import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RegisterToTrainingHandler } from './register-to-training.handler';
import { RegisterToTrainingCommand } from './register-to-training.command';
import { ITrainingRepository } from '../../../domain/repositories/training.repository.interface';
import { ITrainingRegistrationRepository } from '../../../domain/repositories/training-registration.repository.interface';
import {
  createMockTraining,
  createMockTrainingRegistration,
} from '../../../tests/factories';

describe('RegisterToTrainingHandler', () => {
  let handler: RegisterToTrainingHandler;
  let trainingRepository: jest.Mocked<ITrainingRepository>;
  let registrationRepository: jest.Mocked<ITrainingRegistrationRepository>;

  beforeEach(() => {
    trainingRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ITrainingRepository>;

    registrationRepository = {
      existsActiveRegistration: jest.fn(),
      countByTrainingId: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<ITrainingRegistrationRepository>;

    handler = new RegisterToTrainingHandler(
      trainingRepository,
      registrationRepository,
    );
  });

  describe('execute', () => {
    it('should register user with CONFIRMED status when spots are available', async () => {
      const training = createMockTraining({ maxParticipants: 10 });
      const command = new RegisterToTrainingCommand();
      command.trainingId = training.id;
      command.userId = 'user-1';

      trainingRepository.findById.mockResolvedValue(training);
      registrationRepository.existsActiveRegistration.mockResolvedValue(false);
      registrationRepository.countByTrainingId.mockResolvedValue(5);

      const mockRegistration = createMockTrainingRegistration({
        id: 'reg-1',
        status: 'CONFIRMED',
      });
      const createSpy = jest
        .spyOn(registrationRepository, 'create')
        .mockResolvedValue(mockRegistration);

      const result = await handler.execute(command);

      expect(result).toBe('reg-1');
      expect(createSpy).toHaveBeenCalledWith({
        trainingId: training.id,
        userId: 'user-1',
        status: 'CONFIRMED',
        cancelledAt: null,
      });
    });

    it('should register user with WAITLIST status when no spots are available', async () => {
      const training = createMockTraining({ maxParticipants: 10 });
      const command = new RegisterToTrainingCommand();
      command.trainingId = training.id;
      command.userId = 'user-1';

      trainingRepository.findById.mockResolvedValue(training);
      registrationRepository.existsActiveRegistration.mockResolvedValue(false);
      registrationRepository.countByTrainingId.mockResolvedValue(10);

      const mockRegistration = createMockTrainingRegistration({
        id: 'reg-1',
        status: 'WAITLIST',
      });
      const createSpy = jest
        .spyOn(registrationRepository, 'create')
        .mockResolvedValue(mockRegistration);

      const result = await handler.execute(command);

      expect(result).toBe('reg-1');
      expect(createSpy).toHaveBeenCalledWith({
        trainingId: training.id,
        userId: 'user-1',
        status: 'WAITLIST',
        cancelledAt: null,
      });
    });

    it('should register user with CONFIRMED status when maxParticipants is null', async () => {
      const training = createMockTraining({ maxParticipants: null });
      const command = new RegisterToTrainingCommand();
      command.trainingId = training.id;
      command.userId = 'user-1';

      trainingRepository.findById.mockResolvedValue(training);
      registrationRepository.existsActiveRegistration.mockResolvedValue(false);
      registrationRepository.countByTrainingId.mockResolvedValue(100);

      const mockRegistration = createMockTrainingRegistration({
        id: 'reg-1',
        status: 'CONFIRMED',
      });
      const createSpy = jest
        .spyOn(registrationRepository, 'create')
        .mockResolvedValue(mockRegistration);

      const result = await handler.execute(command);

      expect(result).toBe('reg-1');
      expect(createSpy).toHaveBeenCalledWith({
        trainingId: training.id,
        userId: 'user-1',
        status: 'CONFIRMED',
        cancelledAt: null,
      });
    });

    it('should throw NotFoundException when training does not exist', async () => {
      const command = new RegisterToTrainingCommand();
      command.trainingId = 'non-existent-id';
      command.userId = 'user-1';

      trainingRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        'Training with ID non-existent-id not found',
      );
    });

    it('should throw BadRequestException when user is already registered', async () => {
      const training = createMockTraining();
      const command = new RegisterToTrainingCommand();
      command.trainingId = training.id;
      command.userId = 'user-1';

      trainingRepository.findById.mockResolvedValue(training);
      registrationRepository.existsActiveRegistration.mockResolvedValue(true);

      await expect(handler.execute(command)).rejects.toThrow(
        BadRequestException,
      );
      await expect(handler.execute(command)).rejects.toThrow(
        'User is already registered to this training',
      );
    });

    it('should throw BadRequestException when training is not accepting registrations', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const training = createMockTraining({
        scheduledAt: pastDate,
        status: 'SCHEDULED',
      });
      const command = new RegisterToTrainingCommand();
      command.trainingId = training.id;
      command.userId = 'user-1';

      trainingRepository.findById.mockResolvedValue(training);

      await expect(handler.execute(command)).rejects.toThrow(
        BadRequestException,
      );
      await expect(handler.execute(command)).rejects.toThrow(
        'This training is not accepting registrations',
      );
    });
  });
});
