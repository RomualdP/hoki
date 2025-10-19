import { DatabaseService } from '../../../database/database.service';
import { Training } from '../../domain/entities/training.entity';
import { TrainingRegistration } from '../../domain/entities/training-registration.entity';
import { Prisma } from '@prisma/client';

type PrismaDelegate = {
  deleteMany: () => Prisma.PrismaPromise<{ count: number }>;
};

/**
 * Helper class for integration tests with database operations
 * Provides clean state management and simplified data creation
 */
export class TestDatabaseHelper {
  private databaseService: DatabaseService;
  private userIdSequence = 0;
  private trainingIdSequence = 0;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async connect(): Promise<void> {
    await this.databaseService.$connect();
  }

  async disconnect(): Promise<void> {
    await this.databaseService.$disconnect();
  }

  /**
   * Reset database to clean state by deleting all records from all tables
   * Uses Prisma's deleteMany for type-safety and automatic model discovery
   * Gracefully handles missing tables by attempting deletions individually
   */
  async reset(): Promise<void> {
    const modelNames = this.getModelNames();

    // Delete from each table individually to handle missing tables gracefully
    for (const modelName of modelNames) {
      try {
        await this.getModelDelegate(modelName).deleteMany();
      } catch (error) {
        // Skip tables that don't exist in the database yet
        if (
          error instanceof Error &&
          error.message.includes('does not exist in the current database')
        ) {
          console.warn(
            `Skipping ${modelName} table - not yet migrated to test database`,
          );
          continue;
        }
        // Re-throw other errors
        throw error;
      }
    }

    this.userIdSequence = 0;
    this.trainingIdSequence = 0;
  }

  private getModelNames(): string[] {
    return Object.keys(this.databaseService).filter((key) => {
      const value = this.databaseService[key as keyof DatabaseService];
      return (
        typeof value === 'object' && value !== null && 'deleteMany' in value
      );
    });
  }

  private getModelDelegate(modelName: string): PrismaDelegate {
    const delegate = this.databaseService[modelName as keyof DatabaseService];

    if (
      typeof delegate === 'object' &&
      delegate !== null &&
      'deleteMany' in delegate
    ) {
      return delegate as PrismaDelegate;
    }

    throw new Error(`Invalid model name: ${modelName}`);
  }

  /**
   * Create a test user in database
   */
  async createUser(overrides?: {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  }) {
    const id = overrides?.id ?? `test-user-${++this.userIdSequence}`;
    const email = overrides?.email ?? `user${this.userIdSequence}@test.com`;

    return this.databaseService.user.create({
      data: {
        id,
        email,
        firstName: overrides?.firstName ?? 'Test',
        lastName: overrides?.lastName ?? 'User',
        role: 'USER',
      },
    });
  }

  /**
   * Create multiple test users in database
   */
  async createUsers(count: number): Promise<
    Array<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    }>
  > {
    const users: Array<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    }> = [];
    for (let i = 0; i < count; i++) {
      users.push(await this.createUser());
    }
    return users;
  }

  /**
   * Create a test training in database
   */
  async createTraining(overrides?: {
    title?: string;
    scheduledAt?: Date;
    duration?: number;
    maxParticipants?: number;
    status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  }): Promise<Training> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const data = {
      title: overrides?.title ?? `Test Training ${++this.trainingIdSequence}`,
      description: null,
      scheduledAt: overrides?.scheduledAt ?? futureDate,
      duration: overrides?.duration ?? 90,
      location: 'Test Gym',
      maxParticipants: overrides?.maxParticipants ?? 20,
      status: overrides?.status ?? 'SCHEDULED',
    };

    const training = await this.databaseService.training.create({ data });

    return new Training({
      id: training.id,
      title: training.title,
      description: training.description,
      scheduledAt: training.scheduledAt,
      duration: training.duration,
      location: training.location,
      maxParticipants: training.maxParticipants,
      status: training.status as
        | 'SCHEDULED'
        | 'IN_PROGRESS'
        | 'COMPLETED'
        | 'CANCELLED',
      createdAt: training.createdAt,
      updatedAt: training.updatedAt,
    });
  }

  /**
   * Create a test registration in database
   */
  async createRegistration(
    trainingId: string,
    userId: string,
    overrides?: {
      status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'WAITLIST';
      cancelledAt?: Date | null;
    },
  ): Promise<TrainingRegistration> {
    const data = {
      trainingId,
      userId,
      status: overrides?.status ?? 'CONFIRMED',
      cancelledAt: overrides?.cancelledAt ?? null,
    };

    const registration = await this.databaseService.trainingRegistration.create(
      {
        data,
      },
    );

    return new TrainingRegistration({
      id: registration.id,
      trainingId: registration.trainingId,
      userId: registration.userId,
      status: registration.status as
        | 'PENDING'
        | 'CONFIRMED'
        | 'CANCELLED'
        | 'WAITLIST',
      registeredAt: registration.registeredAt,
      cancelledAt: registration.cancelledAt,
    });
  }

  /**
   * Get the underlying DatabaseService instance
   */
  getDatabaseService(): DatabaseService {
    return this.databaseService;
  }
}
