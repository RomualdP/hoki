import { TrainingTemplate } from '../entities/training-template.entity';

export interface CreateTrainingTemplateData {
  clubId: string;
  title: string;
  description: string | null;
  duration: number;
  location: string | null;
  maxParticipants: number | null;
  dayOfWeek: number;
  time: string;
  teamIds: string[];
  isActive: boolean;
}

export interface UpdateTrainingTemplateData {
  title?: string;
  description?: string | null;
  duration?: number;
  location?: string | null;
  maxParticipants?: number | null;
  dayOfWeek?: number;
  time?: string;
  teamIds?: string[];
}

export interface ITrainingTemplateRepository {
  findByClubId(clubId: string): Promise<TrainingTemplate[]>;
  findById(id: string): Promise<TrainingTemplate | null>;
  create(data: CreateTrainingTemplateData): Promise<TrainingTemplate>;
  update(id: string, data: UpdateTrainingTemplateData): Promise<TrainingTemplate>;
  save(template: TrainingTemplate): Promise<TrainingTemplate>;
  delete(id: string): Promise<void>;
  findActiveByClubId(clubId: string): Promise<TrainingTemplate[]>;
}

