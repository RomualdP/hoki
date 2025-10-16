import { TrainingRepository } from './training.repository';
import { TestDatabaseHelper } from '../../../tests/integration/test-database-helper';

describe('TrainingRepository (Integration)', () => {
  let testHelper: TestDatabaseHelper;
  let repository: TrainingRepository;

  beforeAll(async () => {
    testHelper = new TestDatabaseHelper();
    await testHelper.connect();
    repository = new TrainingRepository(testHelper.getDatabaseService());
  });

  beforeEach(async () => {
    await testHelper.reset();
  });

  afterAll(async () => {
    await testHelper.reset();
    await testHelper.disconnect();
  });

  describe('create', () => {
    it('should create a training in the database', async () => {
      const training = await testHelper.createTraining({
        title: 'Integration Test Training',
        duration: 90,
      });

      expect(training.id).toBeDefined();
      expect(training.title).toBe('Integration Test Training');
      expect(training.duration).toBe(90);
      expect(training.status).toBe('SCHEDULED');
    });
  });

  describe('findById', () => {
    it('should find a training by id', async () => {
      const created = await testHelper.createTraining({
        title: 'Test Training',
      });

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.title).toBe('Test Training');
    });

    it('should return null when training does not exist', async () => {
      const found = await repository.findById('non-existent-id');

      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return empty array when no trainings exist', async () => {
      const result = await repository.findAll({
        page: 1,
        limit: 10,
      });

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('should find all trainings with pagination', async () => {
      await testHelper.createTraining({ title: 'Training 1' });
      await testHelper.createTraining({ title: 'Training 2' });

      const result = await repository.findAll({
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should filter trainings by status', async () => {
      await testHelper.createTraining({
        title: 'Scheduled Training',
        status: 'SCHEDULED',
      });

      await testHelper.createTraining({
        title: 'Completed Training',
        status: 'COMPLETED',
      });

      const result = await repository.findAll({
        page: 1,
        limit: 10,
        status: 'SCHEDULED',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].status).toBe('SCHEDULED');
    });

    it('should filter trainings by date range', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      await testHelper.createTraining({
        title: 'Past Training',
        scheduledAt: pastDate,
        status: 'COMPLETED',
      });

      await testHelper.createTraining({
        title: 'Future Training',
        scheduledAt: futureDate,
      });

      const today = new Date();
      const result = await repository.findAll({
        page: 1,
        limit: 10,
        dateFrom: today,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Future Training');
    });
  });

  describe('delete', () => {
    it('should delete a training', async () => {
      const training = await testHelper.createTraining({
        title: 'To Delete',
      });

      await repository.delete(training.id);

      const found = await repository.findById(training.id);
      expect(found).toBeNull();
    });
  });
});
