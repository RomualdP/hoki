import { TrainingTemplate } from '../entities/training-template.entity';

export interface FindAllTemplatesOptions {
  clubId: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface FindAllTemplatesResult {
  data: TrainingTemplate[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateTrainingTemplateData {
  clubId: string;
  title: string;
  description: string | null;
  duration: number;
  location: string | null;
  maxParticipants: number | null;
  dayOfWeek: number;
  time: string;
  isActive: boolean;
  teamIds: string[];
}

export interface UpdateTrainingTemplateData {
  title?: string;
  description?: string | null;
  duration?: number;
  location?: string | null;
  maxParticipants?: number | null;
  dayOfWeek?: number;
  time?: string;
  isActive?: boolean;
  teamIds?: string[];
}

export interface ITrainingTemplateRepository {
  findAll(options: FindAllTemplatesOptions): Promise<FindAllTemplatesResult>;
  findById(id: string): Promise<TrainingTemplate | null>;
  findActiveTemplates(clubId?: string): Promise<TrainingTemplate[]>;
  findConflictingTemplate(
    clubId: string,
    dayOfWeek: number,
    time: string,
    excludeId?: string,
  ): Promise<TrainingTemplate | null>;
  create(template: CreateTrainingTemplateData): Promise<TrainingTemplate>;
  update(
    id: string,
    data: UpdateTrainingTemplateData,
  ): Promise<TrainingTemplate>;
  save(template: TrainingTemplate): Promise<TrainingTemplate>;
  delete(id: string): Promise<void>;
}
