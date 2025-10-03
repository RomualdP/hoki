import {
  TrainingRegistration as PrismaTrainingRegistration,
  RegistrationStatus,
} from '@prisma/client';
import {
  TrainingRegistration,
  TrainingRegistrationProps,
} from '../../../domain/entities/training-registration.entity';

export class TrainingRegistrationMapper {
  static toDomain(
    prismaRegistration: PrismaTrainingRegistration,
  ): TrainingRegistration {
    const props: TrainingRegistrationProps = {
      id: prismaRegistration.id,
      trainingId: prismaRegistration.trainingId,
      userId: prismaRegistration.userId,
      status: prismaRegistration.status as TrainingRegistrationProps['status'],
      registeredAt: prismaRegistration.registeredAt,
      cancelledAt: prismaRegistration.cancelledAt,
    };

    return new TrainingRegistration(props);
  }

  static toDomainArray(
    prismaRegistrations: PrismaTrainingRegistration[],
  ): TrainingRegistration[] {
    return prismaRegistrations.map((prismaRegistration) =>
      this.toDomain(prismaRegistration),
    );
  }

  static toPrismaFromEntity(
    registration: TrainingRegistration,
  ): Omit<PrismaTrainingRegistration, 'id' | 'registeredAt'> {
    return {
      trainingId: registration.trainingId,
      userId: registration.userId,
      status: registration.status,
      cancelledAt: registration.cancelledAt,
    };
  }

  static toPrisma(
    data: Partial<{
      trainingId: string;
      userId: string;
      status: string;
      cancelledAt: Date | null;
    }>,
  ): Partial<
    Omit<PrismaTrainingRegistration, 'id' | 'registeredAt' | 'cancelledAt'>
  > {
    const result: Partial<
      Omit<PrismaTrainingRegistration, 'id' | 'registeredAt' | 'cancelledAt'>
    > = {};

    if (data.trainingId !== undefined) {
      result.trainingId = data.trainingId;
    }
    if (data.userId !== undefined) {
      result.userId = data.userId;
    }
    if (data.status !== undefined) {
      result.status = data.status as RegistrationStatus;
    }

    return result;
  }
}
