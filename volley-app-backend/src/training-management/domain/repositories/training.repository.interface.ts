import { Training } from '../entities/training.entity';

export interface FindAllTrainingsOptions {
  page?: number;
  limit?: number;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface FindAllTrainingsResult {
  data: Training[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateTrainingData {
  title: string;
  description: string | null;
  scheduledAt: Date;
  duration: number;
  location: string | null;
  maxParticipants: number | null;
  status: string;
}

export interface UpdateTrainingData {
  title?: string;
  description?: string | null;
  scheduledAt?: Date;
  duration?: number;
  location?: string | null;
  maxParticipants?: number | null;
  status?: string;
}

export interface ITrainingRepository {
  findAll(options: FindAllTrainingsOptions): Promise<FindAllTrainingsResult>;
  findById(id: string): Promise<Training | null>;
  create(training: CreateTrainingData): Promise<Training>;
  update(id: string, data: UpdateTrainingData): Promise<Training>;
  save(training: Training): Promise<Training>;
  delete(id: string): Promise<void>;
  countParticipants(trainingId: string): Promise<number>;
}
