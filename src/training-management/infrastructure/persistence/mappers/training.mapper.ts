import { Training as PrismaTraining, TrainingStatus } from '@prisma/client';
import {
  Training,
  TrainingProps,
} from '../../../domain/entities/training.entity';

export class TrainingMapper {
  static toDomain(prismaTraining: PrismaTraining): Training {
    const props: TrainingProps = {
      id: prismaTraining.id,
      title: prismaTraining.title,
      description: prismaTraining.description,
      scheduledAt: prismaTraining.scheduledAt,
      duration: prismaTraining.duration,
      location: prismaTraining.location,
      maxParticipants: prismaTraining.maxParticipants,
      status: prismaTraining.status as TrainingProps['status'],
      createdAt: prismaTraining.createdAt,
      updatedAt: prismaTraining.updatedAt,
    };

    return new Training(props);
  }

  static toDomainArray(prismaTrainings: PrismaTraining[]): Training[] {
    return prismaTrainings.map((prismaTraining) =>
      this.toDomain(prismaTraining),
    );
  }

  static toPrismaFromEntity(
    training: Training,
  ): Omit<PrismaTraining, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      title: training.title,
      description: training.description,
      scheduledAt: training.scheduledAt,
      duration: training.duration,
      location: training.location,
      maxParticipants: training.maxParticipants,
      status: training.status,
    };
  }

  static toPrisma(
    data: Partial<{
      title: string;
      description: string | null;
      scheduledAt: Date;
      duration: number;
      location: string | null;
      maxParticipants: number | null;
      status: string;
    }>,
  ): Partial<Omit<PrismaTraining, 'id' | 'createdAt' | 'updatedAt'>> {
    const result: Partial<
      Omit<PrismaTraining, 'id' | 'createdAt' | 'updatedAt'>
    > = {};

    if (data.title !== undefined) {
      result.title = data.title;
    }
    if (data.description !== undefined) {
      result.description = data.description;
    }
    if (data.scheduledAt !== undefined) {
      result.scheduledAt = data.scheduledAt;
    }
    if (data.duration !== undefined) {
      result.duration = data.duration;
    }
    if (data.location !== undefined) {
      result.location = data.location;
    }
    if (data.maxParticipants !== undefined) {
      result.maxParticipants = data.maxParticipants;
    }
    if (data.status !== undefined) {
      result.status = data.status as TrainingStatus;
    }

    return result;
  }
}
