import {
  ITrainingRegistrationRepository,
  CreateRegistrationData,
} from '../../domain/repositories/training-registration.repository.interface';
import {
  TrainingRegistration,
  TrainingRegistrationProps,
} from '../../domain/entities/training-registration.entity';

export class TrainingRegistrationRepositoryMock
  implements ITrainingRegistrationRepository
{
  private registrations: TrainingRegistration[] = [];

  findByTrainingId(): Promise<TrainingRegistration[]> {
    return Promise.resolve(this.registrations);
  }

  findByUserId(): Promise<TrainingRegistration[]> {
    return Promise.resolve(this.registrations);
  }

  findOne(
    trainingId: string,
    userId: string,
  ): Promise<TrainingRegistration | null> {
    const registration =
      this.registrations.find(
        (r) => r.trainingId === trainingId && r.userId === userId,
      ) || null;
    return Promise.resolve(registration);
  }

  findById(id: string): Promise<TrainingRegistration | null> {
    const registration = this.registrations.find((r) => r.id === id) || null;
    return Promise.resolve(registration);
  }

  create(data: CreateRegistrationData): Promise<TrainingRegistration> {
    const props: TrainingRegistrationProps = {
      id: `registration-${Date.now()}`,
      trainingId: data.trainingId,
      userId: data.userId,
      status: data.status as TrainingRegistrationProps['status'],
      registeredAt: new Date(),
      cancelledAt: data.cancelledAt,
    };

    const registration = new TrainingRegistration(props);
    this.registrations.push(registration);
    return Promise.resolve(registration);
  }

  updateStatus(
    id: string,
    status: string,
    cancelledAt: Date | null = null,
  ): Promise<TrainingRegistration> {
    const registration = this.registrations.find((r) => r.id === id);
    if (!registration) {
      throw new Error('Registration not found');
    }

    const updatedProps: TrainingRegistrationProps = {
      id: registration.id,
      trainingId: registration.trainingId,
      userId: registration.userId,
      status: status as TrainingRegistrationProps['status'],
      registeredAt: registration.registeredAt,
      cancelledAt,
    };

    const updatedRegistration = new TrainingRegistration(updatedProps);
    const index = this.registrations.findIndex((r) => r.id === id);
    this.registrations[index] = updatedRegistration;
    return Promise.resolve(updatedRegistration);
  }

  save(registration: TrainingRegistration): Promise<TrainingRegistration> {
    const index = this.registrations.findIndex((r) => r.id === registration.id);
    if (index === -1) {
      throw new Error('Registration not found');
    }
    return Promise.resolve(registration);
  }

  delete(): Promise<void> {
    return Promise.resolve();
  }

  countByTrainingId(trainingId: string): Promise<number> {
    const count = this.registrations.filter(
      (r) =>
        r.trainingId === trainingId &&
        (r.status === 'CONFIRMED' || r.status === 'PENDING'),
    ).length;
    return Promise.resolve(count);
  }

  existsActiveRegistration(
    trainingId: string,
    userId: string,
  ): Promise<boolean> {
    const exists = this.registrations.some(
      (r) => r.trainingId === trainingId && r.userId === userId && r.isActive(),
    );
    return Promise.resolve(exists);
  }

  reset(): void {
    this.registrations = [];
  }
}
