import { TrainingRegistrationRepository } from './training-registration.repository';
import { TestDatabaseHelper } from '../../../__tests__/integration/test-database-helper';

describe('TrainingRegistrationRepository (Integration)', () => {
  let testHelper: TestDatabaseHelper;
  let repository: TrainingRegistrationRepository;
  let trainingId: string;
  let user1Id: string;
  let user2Id: string;

  beforeAll(async () => {
    testHelper = new TestDatabaseHelper();
    await testHelper.connect();
    repository = new TrainingRegistrationRepository(
      testHelper.getDatabaseService(),
    );
  });

  beforeEach(async () => {
    await testHelper.reset();

    // Create test users
    const user1 = await testHelper.createUser();
    const user2 = await testHelper.createUser();
    user1Id = user1.id;
    user2Id = user2.id;

    // Create test training
    const training = await testHelper.createTraining();
    trainingId = training.id;
  });

  afterAll(async () => {
    await testHelper.reset();
    await testHelper.disconnect();
  });

  describe('create', () => {
    it('should create a registration', async () => {
      const registration = await repository.create({
        trainingId,
        userId: user1Id,
        status: 'CONFIRMED',
        cancelledAt: null,
      });

      expect(registration.id).toBeDefined();
      expect(registration.trainingId).toBe(trainingId);
      expect(registration.userId).toBe(user1Id);
      expect(registration.status).toBe('CONFIRMED');
    });
  });

  describe('findByTrainingId', () => {
    it('should find registrations by training id', async () => {
      await testHelper.createRegistration(trainingId, user1Id, {
        status: 'CONFIRMED',
      });

      await testHelper.createRegistration(trainingId, user2Id, {
        status: 'WAITLIST',
      });

      const result = await repository.findByTrainingId({
        trainingId,
      });

      expect(result).toHaveLength(2);
    });

    it('should filter registrations by status', async () => {
      await testHelper.createRegistration(trainingId, user1Id, {
        status: 'CONFIRMED',
      });

      await testHelper.createRegistration(trainingId, user2Id, {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      });

      const result = await repository.findByTrainingId({
        trainingId,
        status: 'CONFIRMED',
      });

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('CONFIRMED');
    });
  });

  describe('countByTrainingId', () => {
    it('should count registrations for a training', async () => {
      await testHelper.createRegistration(trainingId, user1Id);
      await testHelper.createRegistration(trainingId, user2Id);

      const count = await repository.countByTrainingId(trainingId);

      expect(count).toBe(2);
    });

    it('should return 0 when no registrations exist', async () => {
      const count = await repository.countByTrainingId(trainingId);

      expect(count).toBe(0);
    });
  });

  describe('existsActiveRegistration', () => {
    it('should return true when active registration exists', async () => {
      await testHelper.createRegistration(trainingId, user1Id, {
        status: 'CONFIRMED',
      });

      const exists = await repository.existsActiveRegistration(
        trainingId,
        user1Id,
      );

      expect(exists).toBe(true);
    });

    it('should return false when no active registration exists', async () => {
      const user3 = await testHelper.createUser();

      const exists = await repository.existsActiveRegistration(
        trainingId,
        user3.id,
      );

      expect(exists).toBe(false);
    });

    it('should return false when registration is cancelled', async () => {
      const registration = await testHelper.createRegistration(
        trainingId,
        user1Id,
        { status: 'CONFIRMED' },
      );

      await repository.updateStatus(registration.id, 'CANCELLED', new Date());

      const exists = await repository.existsActiveRegistration(
        trainingId,
        user1Id,
      );

      expect(exists).toBe(false);
    });
  });

  describe('updateStatus', () => {
    it('should update registration status', async () => {
      const registration = await testHelper.createRegistration(
        trainingId,
        user1Id,
        { status: 'CONFIRMED' },
      );

      const updated = await repository.updateStatus(
        registration.id,
        'CANCELLED',
        new Date(),
      );

      expect(updated.status).toBe('CANCELLED');
      expect(updated.cancelledAt).not.toBeNull();
    });
  });
});
