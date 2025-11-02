export interface TrainingTemplate {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly duration: number;
  readonly location: string | null;
  readonly maxParticipants: number | null;
  readonly dayOfWeek: number; // 0 = lundi, 6 = dimanche
  readonly time: string; // Format HH:mm
  readonly isActive: boolean;
  readonly teamIds: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateTrainingTemplateData {
  readonly title: string;
  readonly description?: string;
  readonly duration: number;
  readonly location?: string;
  readonly maxParticipants?: number;
  readonly dayOfWeek: number;
  readonly time: string;
  readonly teamIds?: string[];
  readonly isActive?: boolean;
}

export interface UpdateTrainingTemplateData {
  readonly title?: string;
  readonly description?: string | null;
  readonly duration?: number;
  readonly location?: string | null;
  readonly maxParticipants?: number | null;
  readonly dayOfWeek?: number;
  readonly time?: string;
  readonly teamIds?: string[];
}

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Lundi' },
  { value: 1, label: 'Mardi' },
  { value: 2, label: 'Mercredi' },
  { value: 3, label: 'Jeudi' },
  { value: 4, label: 'Vendredi' },
  { value: 5, label: 'Samedi' },
  { value: 6, label: 'Dimanche' },
] as const;

