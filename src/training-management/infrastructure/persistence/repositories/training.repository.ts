import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import {
  CreateTrainingData,
  FindAllTrainingsOptions,
  FindAllTrainingsResult,
  ITrainingRepository,
  UpdateTrainingData,
} from '../../../domain/repositories/training.repository.interface';
import { Training } from '../../../domain/entities/training.entity';
import { TrainingMapper } from '../mappers/training.mapper';

@Injectable()
export class TrainingRepository implements ITrainingRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll(
    options: FindAllTrainingsOptions,
  ): Promise<FindAllTrainingsResult> {
    const { page = 1, limit = 10, status, dateFrom, dateTo } = options;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (dateFrom || dateTo) {
      const dateFilter: Record<string, Date> = {};
      if (dateFrom) {
        dateFilter.gte = dateFrom;
      }
      if (dateTo) {
        dateFilter.lte = dateTo;
      }
      where.scheduledAt = dateFilter;
    }

    const [prismaTrainings, total] = await Promise.all([
      this.database.training.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { scheduledAt: 'desc' },
      }),
      this.database.training.count({ where }),
    ]);

    const trainings = TrainingMapper.toDomainArray(prismaTrainings);

    return {
      data: trainings,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findById(id: string): Promise<Training | null> {
    const prismaTraining = await this.database.training.findUnique({
      where: { id },
    });

    if (!prismaTraining) {
      return null;
    }

    return TrainingMapper.toDomain(prismaTraining);
  }

  async create(training: CreateTrainingData): Promise<Training> {
    const data = TrainingMapper.toPrisma(training);

    const prismaTraining = await this.database.training.create({
      data: data as Parameters<typeof this.database.training.create>[0]['data'],
    });

    return TrainingMapper.toDomain(prismaTraining);
  }

  async update(id: string, data: UpdateTrainingData): Promise<Training> {
    const existingTraining = await this.database.training.findUnique({
      where: { id },
    });

    if (!existingTraining) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }

    const updateData = TrainingMapper.toPrisma(data);

    const prismaTraining = await this.database.training.update({
      where: { id },
      data: updateData as Parameters<
        typeof this.database.training.update
      >[0]['data'],
    });

    return TrainingMapper.toDomain(prismaTraining);
  }

  async save(training: Training): Promise<Training> {
    const existingTraining = await this.database.training.findUnique({
      where: { id: training.id },
    });

    if (!existingTraining) {
      throw new NotFoundException(`Training with ID ${training.id} not found`);
    }

    const updateData = TrainingMapper.toPrisma({
      title: training.title,
      description: training.description,
      scheduledAt: training.scheduledAt,
      duration: training.duration,
      location: training.location,
      maxParticipants: training.maxParticipants,
      status: training.status,
    });

    const prismaTraining = await this.database.training.update({
      where: { id: training.id },
      data: updateData as Parameters<
        typeof this.database.training.update
      >[0]['data'],
    });

    return TrainingMapper.toDomain(prismaTraining);
  }

  async delete(id: string): Promise<void> {
    const existingTraining = await this.database.training.findUnique({
      where: { id },
    });

    if (!existingTraining) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }

    await this.database.training.delete({ where: { id } });
  }

  async countParticipants(trainingId: string): Promise<number> {
    return this.database.trainingRegistration.count({
      where: {
        trainingId,
        status: {
          in: ['CONFIRMED', 'PENDING'],
        },
      },
    });
  }
}
