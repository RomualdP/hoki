export interface TrainingReadModel {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: Date;
  duration: number;
  location: string | null;
  maxParticipants: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingListReadModel {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: Date;
  duration: number;
  location: string | null;
  maxParticipants: number | null;
  status: string;
}
