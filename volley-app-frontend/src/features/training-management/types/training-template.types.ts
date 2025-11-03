export interface TrainingTemplate {
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

export interface TrainingTemplateListItem {
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

export interface CreateTrainingTemplateInput {
  title: string;
  description?: string;
  duration: number;
  location?: string;
  maxParticipants?: number;
  dayOfWeek: number;
  time: string;
  isActive?: boolean;
  teamIds?: string[];
}

export interface UpdateTrainingTemplateInput {
  title?: string;
  description?: string;
  duration?: number;
  location?: string;
  maxParticipants?: number;
  dayOfWeek?: number;
  time?: string;
  isActive?: boolean;
  teamIds?: string[];
}

export interface TrainingTemplatesResponse {
  data: TrainingTemplateListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const DAYS_OF_WEEK = [
  { value: 0, label: "Lundi" },
  { value: 1, label: "Mardi" },
  { value: 2, label: "Mercredi" },
  { value: 3, label: "Jeudi" },
  { value: 4, label: "Vendredi" },
  { value: 5, label: "Samedi" },
  { value: 6, label: "Dimanche" },
] as const;

export function getDayLabel(dayOfWeek: number): string {
  return DAYS_OF_WEEK[dayOfWeek]?.label ?? "Inconnu";
}
