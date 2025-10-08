import {
  ITrainingRepository,
  FindAllTrainingsResult,
  CreateTrainingData,
} from '../../domain/repositories/training.repository.interface';
import { Training, TrainingProps } from '../../domain/entities/training.entity';

export class TrainingRepositoryMock implements ITrainingRepository {
  private trainings: Training[] = [];
  // eslint-disable-next-line @typescript-eslint/require-await
  async findAll(): Promise<FindAllTrainingsResult> {
    return {
      data: this.trainings,
      meta: {
        total: this.trainings.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<Training | null> {
    return this.trainings.find((t) => t.id === id) || null;
  }

  create(data: CreateTrainingData): Promise<Training> {
    const props: TrainingProps = {
      id: `training-${Date.now()}`,
      title: data.title,
      description: data.description,
      scheduledAt: data.scheduledAt,
      duration: data.duration,
      location: data.location,
      maxParticipants: data.maxParticipants,
      status: data.status as TrainingProps['status'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const training = new Training(props);
    this.trainings.push(training);
    return Promise.resolve(training);
  }

  update(): Promise<Training> {
    const training = this.trainings[0];
    if (!training) {
      throw new Error('Training not found');
    }
    return Promise.resolve(training);
  }

  delete(): Promise<void> {
    return Promise.resolve();
  }

  countParticipants(): Promise<number> {
    return Promise.resolve(0);
  }

  reset(): void {
    this.trainings = [];
  }
}
