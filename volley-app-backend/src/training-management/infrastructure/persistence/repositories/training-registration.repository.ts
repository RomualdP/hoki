import { Injectable, NotFoundException } from '@nestjs/common';
import { RegistrationStatus } from '@prisma/client';
import { DatabaseService } from '../../../../database/database.service';
import {
  CreateRegistrationData,
  FindRegistrationsByTrainingOptions,
  FindRegistrationsByUserOptions,
  ITrainingRegistrationRepository,
} from '../../../domain/repositories/training-registration.repository.interface';
import { TrainingRegistration } from '../../../domain/entities/training-registration.entity';
import { TrainingRegistrationMapper } from '../mappers/training-registration.mapper';

@Injectable()
export class TrainingRegistrationRepository
  implements ITrainingRegistrationRepository
{
  constructor(private readonly database: DatabaseService) {}

  async findByTrainingId(
    options: FindRegistrationsByTrainingOptions,
  ): Promise<TrainingRegistration[]> {
    const { trainingId, status } = options;

    const where: Record<string, unknown> = { trainingId };

    if (status) {
      where.status = status;
    }

    const prismaRegistrations =
      await this.database.trainingRegistration.findMany({
        where,
        orderBy: { registeredAt: 'asc' },
      });

    return TrainingRegistrationMapper.toDomainArray(prismaRegistrations);
  }

  async findByUserId(
    options: FindRegistrationsByUserOptions,
  ): Promise<TrainingRegistration[]> {
    const { userId, status } = options;

    const where: Record<string, unknown> = { userId };

    if (status) {
      where.status = status;
    }

    const prismaRegistrations =
      await this.database.trainingRegistration.findMany({
        where,
        orderBy: { registeredAt: 'desc' },
      });

    return TrainingRegistrationMapper.toDomainArray(prismaRegistrations);
  }

  async findOne(
    trainingId: string,
    userId: string,
  ): Promise<TrainingRegistration | null> {
    const prismaRegistration =
      await this.database.trainingRegistration.findUnique({
        where: {
          trainingId_userId: {
            trainingId,
            userId,
          },
        },
      });

    if (!prismaRegistration) {
      return null;
    }

    return TrainingRegistrationMapper.toDomain(prismaRegistration);
  }

  async create(
    registration: CreateRegistrationData,
  ): Promise<TrainingRegistration> {
    const data = TrainingRegistrationMapper.toPrisma(registration);

    const prismaRegistration = await this.database.trainingRegistration.create({
      data: {
        trainingId: data.trainingId as string,
        userId: data.userId as string,
        status: data.status as string as RegistrationStatus,
      },
    });

    return TrainingRegistrationMapper.toDomain(prismaRegistration);
  }

  async findById(id: string): Promise<TrainingRegistration | null> {
    const prismaRegistration =
      await this.database.trainingRegistration.findUnique({
        where: { id },
      });

    if (!prismaRegistration) {
      return null;
    }

    return TrainingRegistrationMapper.toDomain(prismaRegistration);
  }

  async updateStatus(
    id: string,
    status: string,
    cancelledAt: Date | null = null,
  ): Promise<TrainingRegistration> {
    const existingRegistration =
      await this.database.trainingRegistration.findUnique({
        where: { id },
      });

    if (!existingRegistration) {
      throw new NotFoundException(`Registration with ID ${id} not found`);
    }

    const prismaRegistration = await this.database.trainingRegistration.update({
      where: { id },
      data: {
        status: status as RegistrationStatus,
        cancelledAt,
      },
    });

    return TrainingRegistrationMapper.toDomain(prismaRegistration);
  }

  async save(
    registration: TrainingRegistration,
  ): Promise<TrainingRegistration> {
    const existingRegistration =
      await this.database.trainingRegistration.findUnique({
        where: { id: registration.id },
      });

    if (!existingRegistration) {
      throw new NotFoundException(
        `Registration with ID ${registration.id} not found`,
      );
    }

    const prismaRegistration = await this.database.trainingRegistration.update({
      where: { id: registration.id },
      data: {
        status: registration.status as RegistrationStatus,
        cancelledAt: registration.cancelledAt,
      },
    });

    return TrainingRegistrationMapper.toDomain(prismaRegistration);
  }

  async delete(id: string): Promise<void> {
    const existingRegistration =
      await this.database.trainingRegistration.findUnique({
        where: { id },
      });

    if (!existingRegistration) {
      throw new NotFoundException(`Registration with ID ${id} not found`);
    }

    await this.database.trainingRegistration.delete({ where: { id } });
  }

  async countByTrainingId(trainingId: string): Promise<number> {
    return this.database.trainingRegistration.count({
      where: {
        trainingId,
        status: {
          in: ['CONFIRMED', 'PENDING'],
        },
      },
    });
  }

  async existsActiveRegistration(
    trainingId: string,
    userId: string,
  ): Promise<boolean> {
    const count = await this.database.trainingRegistration.count({
      where: {
        trainingId,
        userId,
        status: {
          in: ['CONFIRMED', 'PENDING', 'WAITLIST'],
        },
      },
    });

    return count > 0;
  }
}
