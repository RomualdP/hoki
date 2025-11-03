export interface TrainingTemplateReadModel {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingTemplateListReadModel {
  id: string;
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
