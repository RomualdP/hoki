import { Training } from '../../domain/entities/training.entity';

export const createMockTraining = (
  overrides?: Partial<{
    id: string;
    title: string;
    description: string | null;
    scheduledAt: Date;
    duration: number;
    location: string | null;
    maxParticipants: number | null;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    createdAt: Date;
    updatedAt: Date;
  }>,
): Training => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  return new Training({
    id: 'training-test-1',
    title: 'Test Training Session',
    description: 'Test training description',
    scheduledAt: futureDate,
    duration: 90,
    location: 'Gym A',
    maxParticipants: 20,
    status: 'SCHEDULED',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });
};
