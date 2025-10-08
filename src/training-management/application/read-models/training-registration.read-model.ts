export interface TrainingRegistrationReadModel {
  id: string;
  trainingId: string;
  userId: string;
  status: string;
  registeredAt: Date;
  cancelledAt: Date | null;
}
