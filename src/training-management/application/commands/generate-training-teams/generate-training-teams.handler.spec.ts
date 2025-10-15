import { NotFoundException } from '@nestjs/common';
import { GenerateTrainingTeamsHandler } from './generate-training-teams.handler';
import { GenerateTrainingTeamsCommand } from './generate-training-teams.command';
import { ITrainingRepository } from '../../../domain/repositories/training.repository.interface';
import { ITrainingRegistrationRepository } from '../../../domain/repositories/training-registration.repository.interface';
import { ITrainingTeamRepository } from '../../../domain/repositories/training-team.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import {
  IUnitOfWork,
  PrismaTransactionClient,
} from '../../../../database/unit-of-work.interface';
import { Training } from '../../../domain/entities/training.entity';
import { TrainingRegistration } from '../../../domain/entities/training-registration.entity';
import { TrainingTeam } from '../../../domain/entities/training-team.entity';

describe('GenerateTrainingTeamsHandler', () => {
  let handler: GenerateTrainingTeamsHandler;
  let trainingRepository: jest.Mocked<ITrainingRepository>;
  let registrationRepository: jest.Mocked<ITrainingRegistrationRepository>;
  let teamRepository: jest.Mocked<ITrainingTeamRepository>;
  let userRepository: jest.Mocked<IUserRepository>;
  let unitOfWork: jest.Mocked<IUnitOfWork>;

  const mockTraining = {
    id: 'training-1',
    title: 'Test Training',
    scheduledAt: new Date(),
  } as Training;

  const mockRegistrations = [
    {
      id: 'reg-1',
      userId: 'user-1',
      trainingId: 'training-1',
      status: 'CONFIRMED',
    },
    {
      id: 'reg-2',
      userId: 'user-2',
      trainingId: 'training-1',
      status: 'CONFIRMED',
    },
    {
      id: 'reg-3',
      userId: 'user-3',
      trainingId: 'training-1',
      status: 'CONFIRMED',
    },
    {
      id: 'reg-4',
      userId: 'user-4',
      trainingId: 'training-1',
      status: 'CONFIRMED',
    },
  ] as TrainingRegistration[];

  const mockUsers = [
    {
      id: 'user-1',
      profile: { gender: 'MALE' },
      skills: [{ level: 5 }],
      attributes: [
        { attribute: 'FITNESS', value: 1.0 },
        { attribute: 'LEADERSHIP', value: 1.0 },
      ],
    },
    {
      id: 'user-2',
      profile: { gender: 'FEMALE' },
      skills: [{ level: 4 }],
      attributes: [
        { attribute: 'FITNESS', value: 1.0 },
        { attribute: 'LEADERSHIP', value: 1.0 },
      ],
    },
    {
      id: 'user-3',
      profile: { gender: 'MALE' },
      skills: [{ level: 3 }],
      attributes: [
        { attribute: 'FITNESS', value: 1.0 },
        { attribute: 'LEADERSHIP', value: 1.0 },
      ],
    },
    {
      id: 'user-4',
      profile: { gender: 'FEMALE' },
      skills: [{ level: 2 }],
      attributes: [
        { attribute: 'FITNESS', value: 1.0 },
        { attribute: 'LEADERSHIP', value: 1.0 },
      ],
    },
  ];

  beforeEach(() => {
    trainingRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ITrainingRepository>;

    registrationRepository = {
      findByTrainingId: jest.fn(),
    } as unknown as jest.Mocked<ITrainingRegistrationRepository>;

    teamRepository = {
      deleteByTrainingId: jest.fn(),
      createMany: jest.fn(),
    } as unknown as jest.Mocked<ITrainingTeamRepository>;

    userRepository = {
      findManyByIdsWithDetails: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    unitOfWork = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<IUnitOfWork>;

    handler = new GenerateTrainingTeamsHandler(
      trainingRepository,
      registrationRepository,
      teamRepository,
      userRepository,
      unitOfWork,
    );
  });

  describe('execute', () => {
    it('should throw NotFoundException when training does not exist', async () => {
      const command = new GenerateTrainingTeamsCommand();
      command.trainingId = 'non-existent-id';
      trainingRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        "Entraînement avec l'ID non-existent-id non trouvé",
      );
    });

    it('should throw error when no confirmed participants', async () => {
      const command = new GenerateTrainingTeamsCommand();
      command.trainingId = 'training-1';
      trainingRepository.findById.mockResolvedValue(mockTraining);
      registrationRepository.findByTrainingId.mockResolvedValue([]);

      await expect(handler.execute(command)).rejects.toThrow(
        'Aucun participant confirmé pour cet entraînement',
      );
    });

    it('should generate teams within a transaction', async () => {
      const command = new GenerateTrainingTeamsCommand();
      command.trainingId = 'training-1';
      const mockCreatedTeams = [
        {
          id: 'team-1',
          trainingId: 'training-1',
          name: 'Équipe 1',
          memberIds: ['user-1', 'user-2'],
          averageLevel: 4.5,
        },
      ] as TrainingTeam[];

      trainingRepository.findById.mockResolvedValue(mockTraining);
      registrationRepository.findByTrainingId.mockResolvedValue(
        mockRegistrations,
      );
      userRepository.findManyByIdsWithDetails.mockResolvedValue(mockUsers);

      const executeSpy = jest
        .fn()
        .mockImplementation(
          (work: (tx: PrismaTransactionClient) => Promise<string[]>) => {
            teamRepository.createMany.mockResolvedValue(mockCreatedTeams);
            return work({} as PrismaTransactionClient);
          },
        );
      unitOfWork.execute = executeSpy as unknown as typeof unitOfWork.execute;

      const result = await handler.execute(command);

      expect(executeSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(['team-1']);
    });

    it('should delete old teams and create new ones atomically', async () => {
      const command = new GenerateTrainingTeamsCommand();
      command.trainingId = 'training-1';
      const mockCreatedTeams = [
        {
          id: 'team-1',
          trainingId: 'training-1',
          name: 'Équipe 1',
          memberIds: ['user-1', 'user-2'],
          averageLevel: 4.5,
        },
        {
          id: 'team-2',
          trainingId: 'training-1',
          name: 'Équipe 2',
          memberIds: ['user-3', 'user-4'],
          averageLevel: 2.5,
        },
      ] as TrainingTeam[];

      trainingRepository.findById.mockResolvedValue(mockTraining);
      registrationRepository.findByTrainingId.mockResolvedValue(
        mockRegistrations,
      );
      userRepository.findManyByIdsWithDetails.mockResolvedValue(mockUsers);

      const executeSpy = jest
        .fn()
        .mockImplementation(
          (work: (tx: PrismaTransactionClient) => Promise<string[]>) => {
            teamRepository.createMany.mockResolvedValue(mockCreatedTeams);
            return work({} as PrismaTransactionClient);
          },
        );
      unitOfWork.execute = executeSpy as unknown as typeof unitOfWork.execute;

      const result = await handler.execute(command);

      expect(executeSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(['team-1', 'team-2']);
      expect(result).toHaveLength(2);
    });

    it('should rollback transaction if team creation fails', async () => {
      const command = new GenerateTrainingTeamsCommand();
      command.trainingId = 'training-1';

      trainingRepository.findById.mockResolvedValue(mockTraining);
      registrationRepository.findByTrainingId.mockResolvedValue(
        mockRegistrations,
      );
      userRepository.findManyByIdsWithDetails.mockResolvedValue(mockUsers);

      const creationError = new Error('Database error during team creation');
      const executeSpy = jest.fn().mockRejectedValue(creationError);
      unitOfWork.execute = executeSpy;

      await expect(handler.execute(command)).rejects.toThrow(creationError);

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should pass transaction context to repository methods', async () => {
      const command = new GenerateTrainingTeamsCommand();
      command.trainingId = 'training-1';
      const mockTx = { trainingTeam: {} } as never;
      const mockCreatedTeams = [
        {
          id: 'team-1',
          trainingId: 'training-1',
          name: 'Équipe 1',
          memberIds: ['user-1', 'user-2'],
          averageLevel: 4.5,
        },
      ] as TrainingTeam[];

      trainingRepository.findById.mockResolvedValue(mockTraining);
      registrationRepository.findByTrainingId.mockResolvedValue(
        mockRegistrations,
      );
      userRepository.findManyByIdsWithDetails.mockResolvedValue(mockUsers);

      const deleteByTrainingIdSpy = jest.fn().mockResolvedValue(undefined);
      const createManySpy = jest.fn().mockResolvedValue(mockCreatedTeams);
      teamRepository.deleteByTrainingId = deleteByTrainingIdSpy;
      teamRepository.createMany = createManySpy;

      const executeSpy = jest
        .fn()
        .mockImplementation(
          (work: (tx: PrismaTransactionClient) => Promise<string[]>) => {
            return work(mockTx);
          },
        );
      unitOfWork.execute = executeSpy as unknown as typeof unitOfWork.execute;

      await handler.execute(command);

      expect(deleteByTrainingIdSpy).toHaveBeenCalledWith('training-1', mockTx);
      expect(createManySpy).toHaveBeenCalledWith(expect.any(Array), mockTx);
    });

    it('should calculate player levels correctly', async () => {
      const command = new GenerateTrainingTeamsCommand();
      command.trainingId = 'training-1';
      const mockCreatedTeams = [
        {
          id: 'team-1',
          trainingId: 'training-1',
          name: 'Équipe 1',
          memberIds: ['user-1', 'user-2'],
          averageLevel: 4.5,
        },
      ] as TrainingTeam[];

      trainingRepository.findById.mockResolvedValue(mockTraining);
      registrationRepository.findByTrainingId.mockResolvedValue(
        mockRegistrations,
      );
      const findManyByIdsWithDetailsSpy = jest
        .fn()
        .mockResolvedValue(mockUsers);
      userRepository.findManyByIdsWithDetails = findManyByIdsWithDetailsSpy;

      const executeSpy = jest
        .fn()
        .mockImplementation(
          (work: (tx: PrismaTransactionClient) => Promise<string[]>) => {
            teamRepository.createMany.mockResolvedValue(mockCreatedTeams);
            return work({} as PrismaTransactionClient);
          },
        );
      unitOfWork.execute = executeSpy as unknown as typeof unitOfWork.execute;

      await handler.execute(command);

      expect(findManyByIdsWithDetailsSpy).toHaveBeenCalledWith([
        'user-1',
        'user-2',
        'user-3',
        'user-4',
      ]);
    });
  });
});
