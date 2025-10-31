import { Training } from './training.entity';
import { DomainException } from '../exceptions/domain.exception';

describe('Training Entity', () => {
  const createValidTrainingProps = (overrides = {}) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    return {
      id: 'training-1',
      title: 'Test Training',
      description: 'Test description',
      scheduledAt: futureDate,
      duration: 90,
      location: 'Gym A',
      maxParticipants: 20,
      status: 'SCHEDULED' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  };

  describe('canAcceptRegistrations', () => {
    it('should return true when training is SCHEDULED and in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const training = new Training(
        createValidTrainingProps({
          status: 'SCHEDULED',
          scheduledAt: futureDate,
        }),
      );

      expect(training.canAcceptRegistrations()).toBe(true);
    });

    it('should return false when training is SCHEDULED but in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const training = new Training(
        createValidTrainingProps({
          status: 'SCHEDULED',
          scheduledAt: pastDate,
        }),
      );

      expect(training.canAcceptRegistrations()).toBe(false);
    });

    it('should return false when training is IN_PROGRESS', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const training = new Training(
        createValidTrainingProps({
          status: 'IN_PROGRESS',
          scheduledAt: futureDate,
        }),
      );

      expect(training.canAcceptRegistrations()).toBe(false);
    });

    it('should return false when training is COMPLETED', () => {
      const training = new Training(
        createValidTrainingProps({
          status: 'COMPLETED',
        }),
      );

      expect(training.canAcceptRegistrations()).toBe(false);
    });

    it('should return false when training is CANCELLED', () => {
      const training = new Training(
        createValidTrainingProps({
          status: 'CANCELLED',
        }),
      );

      expect(training.canAcceptRegistrations()).toBe(false);
    });
  });

  describe('hasAvailableSpots', () => {
    it('should return true when current participants is less than max', () => {
      const training = new Training(
        createValidTrainingProps({
          maxParticipants: 20,
        }),
      );

      expect(training.hasAvailableSpots(15)).toBe(true);
    });

    it('should return false when current participants equals max', () => {
      const training = new Training(
        createValidTrainingProps({
          maxParticipants: 20,
        }),
      );

      expect(training.hasAvailableSpots(20)).toBe(false);
    });

    it('should return false when current participants exceeds max', () => {
      const training = new Training(
        createValidTrainingProps({
          maxParticipants: 20,
        }),
      );

      expect(training.hasAvailableSpots(25)).toBe(false);
    });

    it('should return true when maxParticipants is null (unlimited)', () => {
      const training = new Training(
        createValidTrainingProps({
          maxParticipants: null,
        }),
      );

      expect(training.hasAvailableSpots(100)).toBe(true);
      expect(training.hasAvailableSpots(1000)).toBe(true);
    });

    it('should return true when current participants is 0', () => {
      const training = new Training(
        createValidTrainingProps({
          maxParticipants: 20,
        }),
      );

      expect(training.hasAvailableSpots(0)).toBe(true);
    });
  });

  describe('validation', () => {
    it('should throw when title is too short', () => {
      expect(() => {
        new Training(
          createValidTrainingProps({
            title: 'AB',
          }),
        );
      }).toThrow(DomainException);
      expect(() => {
        new Training(
          createValidTrainingProps({
            title: 'AB',
          }),
        );
      }).toThrow('Training title must be at least 3 characters');
    });

    it('should throw when title is empty', () => {
      expect(() => {
        new Training(
          createValidTrainingProps({
            title: '',
          }),
        );
      }).toThrow(DomainException);
    });

    it('should throw when duration is too short', () => {
      expect(() => {
        new Training(
          createValidTrainingProps({
            duration: 20,
          }),
        );
      }).toThrow(DomainException);
      expect(() => {
        new Training(
          createValidTrainingProps({
            duration: 20,
          }),
        );
      }).toThrow('Training duration must be between 30 and 300 minutes');
    });

    it('should throw when duration is too long', () => {
      expect(() => {
        new Training(
          createValidTrainingProps({
            duration: 400,
          }),
        );
      }).toThrow(DomainException);
    });

    it('should throw when maxParticipants is less than 1', () => {
      expect(() => {
        new Training(
          createValidTrainingProps({
            maxParticipants: 0,
          }),
        );
      }).toThrow(DomainException);
      expect(() => {
        new Training(
          createValidTrainingProps({
            maxParticipants: 0,
          }),
        );
      }).toThrow('Max participants must be at least 1');
    });

    it('should accept valid minumum duration', () => {
      expect(() => {
        new Training(
          createValidTrainingProps({
            duration: 30,
          }),
        );
      }).not.toThrow();
    });

    it('should accept valid maximum duration', () => {
      expect(() => {
        new Training(
          createValidTrainingProps({
            duration: 300,
          }),
        );
      }).not.toThrow();
    });
  });
});
