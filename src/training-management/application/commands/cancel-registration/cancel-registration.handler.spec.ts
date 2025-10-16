import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CancelRegistrationHandler } from './cancel-registration.handler';
import { CancelRegistrationCommand } from './cancel-registration.command';
import { ITrainingRegistrationRepository } from '../../../domain/repositories/training-registration.repository.interface';
import { createMockTrainingRegistration } from '../../../tests/factories';

describe('CancelRegistrationHandler', () => {
  let handler: CancelRegistrationHandler;
  let registrationRepository: jest.Mocked<ITrainingRegistrationRepository>;

  beforeEach(() => {
    registrationRepository = {
      findOne: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as jest.Mocked<ITrainingRegistrationRepository>;

    handler = new CancelRegistrationHandler(registrationRepository);
  });

  describe('execute', () => {
    it('should successfully cancel an active registration', async () => {
      const registration = createMockTrainingRegistration({
        status: 'CONFIRMED',
      });
      const command = new CancelRegistrationCommand();
      command.trainingId = registration.trainingId;
      command.userId = registration.userId;

      registrationRepository.findOne.mockResolvedValue(registration);
      const updatedRegistration = createMockTrainingRegistration({
        ...registration,
        status: 'CANCELLED',
      });
      const updateStatusSpy = jest
        .spyOn(registrationRepository, 'updateStatus')
        .mockResolvedValue(updatedRegistration);

      await handler.execute(command);

      expect(updateStatusSpy).toHaveBeenCalledWith(
        registration.id,
        'CANCELLED',
        expect.any(Date),
      );
    });

    it('should successfully cancel a pending registration', async () => {
      const registration = createMockTrainingRegistration({
        status: 'PENDING',
      });
      const command = new CancelRegistrationCommand();
      command.trainingId = registration.trainingId;
      command.userId = registration.userId;

      registrationRepository.findOne.mockResolvedValue(registration);
      const updatedRegistration = createMockTrainingRegistration({
        ...registration,
        status: 'CANCELLED',
      });
      const updateStatusSpy = jest
        .spyOn(registrationRepository, 'updateStatus')
        .mockResolvedValue(updatedRegistration);

      await handler.execute(command);

      expect(updateStatusSpy).toHaveBeenCalledWith(
        registration.id,
        'CANCELLED',
        expect.any(Date),
      );
    });

    it('should throw NotFoundException when registration does not exist', async () => {
      const command = new CancelRegistrationCommand();
      command.trainingId = 'training-1';
      command.userId = 'user-1';

      registrationRepository.findOne.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        'Registration not found',
      );
    });

    it('should throw BadRequestException when registration cannot be cancelled', async () => {
      const registration = createMockTrainingRegistration({
        status: 'CANCELLED',
      });
      const command = new CancelRegistrationCommand();
      command.trainingId = registration.trainingId;
      command.userId = registration.userId;

      registrationRepository.findOne.mockResolvedValue(registration);

      await expect(handler.execute(command)).rejects.toThrow(
        BadRequestException,
      );
      await expect(handler.execute(command)).rejects.toThrow(
        'This registration cannot be cancelled',
      );
    });
  });
});
