import { TrainingRegistration } from '../../domain/entities/training-registration.entity';

export const createMockTrainingRegistration = (
  overrides?: Partial<{
    id: string;
    trainingId: string;
    userId: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'WAITLIST';
    registeredAt: Date;
    cancelledAt: Date | null;
  }>,
): TrainingRegistration => {
  return new TrainingRegistration({
    id: 'registration-test-1',
    trainingId: 'training-test-1',
    userId: 'user-test-1',
    status: 'CONFIRMED',
    registeredAt: new Date(),
    cancelledAt: null,
    ...overrides,
  });
};
