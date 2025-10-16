import { TrainingTeamRepository } from './training-team.repository';
import { TestDatabaseHelper } from '../../../tests/integration/test-database-helper';
import { PrismaUnitOfWork } from '../../../../database/unit-of-work';

describe('TrainingTeamRepository (Integration)', () => {
  let testHelper: TestDatabaseHelper;
  let repository: TrainingTeamRepository;
  let unitOfWork: PrismaUnitOfWork;
  let trainingId: string;
  let userIds: string[];

  beforeAll(async () => {
    testHelper = new TestDatabaseHelper();
    await testHelper.connect();
    const databaseService = testHelper.getDatabaseService();
    repository = new TrainingTeamRepository(databaseService);
    unitOfWork = new PrismaUnitOfWork(databaseService);
  });

  beforeEach(async () => {
    await testHelper.reset();

    // Create 8 test users for team members
    const users = await testHelper.createUsers(8);
    userIds = users.map((u) => u.id);

    // Create test training
    const training = await testHelper.createTraining();
    trainingId = training.id;
  });

  afterAll(async () => {
    await testHelper.reset();
    await testHelper.disconnect();
  });

  describe('createMany', () => {
    it('should create multiple teams in a transaction', async () => {
      const teams = [
        {
          trainingId,
          name: 'Équipe 1',
          memberIds: userIds.slice(0, 4),
          averageLevel: 50,
        },
        {
          trainingId,
          name: 'Équipe 2',
          memberIds: userIds.slice(4, 8),
          averageLevel: 45,
        },
      ];

      const created = await repository.createMany(teams);

      expect(created).toHaveLength(2);
      expect(created[0].name).toBe('Équipe 1');
      expect(created[0].memberIds).toHaveLength(4);
      expect(created[1].name).toBe('Équipe 2');
    });
  });

  describe('findByTrainingId', () => {
    it('should find teams by training id', async () => {
      const teams = [
        {
          trainingId,
          name: 'Équipe 1',
          memberIds: userIds.slice(0, 4),
          averageLevel: 50,
        },
      ];

      await repository.createMany(teams);

      const result = await repository.findByTrainingId(trainingId);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Équipe 1');
      expect(result[0].memberIds).toHaveLength(4);
    });

    it('should return empty array when no teams exist', async () => {
      const result = await repository.findByTrainingId(trainingId);

      expect(result).toEqual([]);
    });
  });

  describe('deleteByTrainingId', () => {
    it('should delete all teams for a training', async () => {
      const teams = [
        {
          trainingId,
          name: 'Équipe 1',
          memberIds: userIds.slice(0, 4),
          averageLevel: 50,
        },
        {
          trainingId,
          name: 'Équipe 2',
          memberIds: userIds.slice(4, 8),
          averageLevel: 45,
        },
      ];

      await repository.createMany(teams);

      await repository.deleteByTrainingId(trainingId);

      const result = await repository.findByTrainingId(trainingId);
      expect(result).toEqual([]);
    });
  });

  describe('Unit of Work transaction support', () => {
    it('should work with unit of work', async () => {
      await unitOfWork.execute(async (tx) => {
        const teams = [
          {
            trainingId,
            name: 'Équipe 1',
            memberIds: userIds.slice(0, 4),
            averageLevel: 50,
          },
        ];

        const created = await repository.createMany(teams, tx);
        expect(created).toHaveLength(1);
      });

      const result = await repository.findByTrainingId(trainingId);
      expect(result).toHaveLength(1);
    });

    it('should rollback on unit of work error', async () => {
      await expect(
        unitOfWork.execute(async (tx) => {
          const teams = [
            {
              trainingId,
              name: 'Équipe 1',
              memberIds: userIds.slice(0, 4),
              averageLevel: 50,
            },
          ];

          await repository.createMany(teams, tx);

          throw new Error('Simulated error');
        }),
      ).rejects.toThrow('Simulated error');

      const result = await repository.findByTrainingId(trainingId);
      expect(result).toEqual([]);
    });
  });
});
