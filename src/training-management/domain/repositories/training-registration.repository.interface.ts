import { TrainingRegistration } from '../entities/training-registration.entity';

export interface FindRegistrationsByTrainingOptions {
  trainingId: string;
  status?: string;
}

export interface FindRegistrationsByUserOptions {
  userId: string;
  status?: string;
}

export interface CreateRegistrationData {
  trainingId: string;
  userId: string;
  status: string;
  cancelledAt: Date | null;
}

export interface ITrainingRegistrationRepository {
  findByTrainingId(
    options: FindRegistrationsByTrainingOptions,
  ): Promise<TrainingRegistration[]>;
  findByUserId(
    options: FindRegistrationsByUserOptions,
  ): Promise<TrainingRegistration[]>;
  findOne(
    trainingId: string,
    userId: string,
  ): Promise<TrainingRegistration | null>;
  create(registration: CreateRegistrationData): Promise<TrainingRegistration>;
  updateStatus(
    id: string,
    status: string,
    cancelledAt?: Date | null,
  ): Promise<TrainingRegistration>;
  delete(id: string): Promise<void>;
  countByTrainingId(trainingId: string): Promise<number>;
  existsActiveRegistration(
    trainingId: string,
    userId: string,
  ): Promise<boolean>;
}
