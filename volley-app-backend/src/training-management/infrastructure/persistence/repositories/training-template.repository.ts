import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import {
  CreateTrainingTemplateData,
  FindAllTemplatesOptions,
  FindAllTemplatesResult,
  ITrainingTemplateRepository,
  UpdateTrainingTemplateData,
} from '../../../domain/repositories/training-template.repository.interface';
import { TrainingTemplate } from '../../../domain/entities/training-template.entity';
import { TrainingTemplateMapper } from '../mappers/training-template.mapper';

@Injectable()
export class TrainingTemplateRepository implements ITrainingTemplateRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll(
    options: FindAllTemplatesOptions,
  ): Promise<FindAllTemplatesResult> {
    const { clubId, page = 1, limit = 10, isActive } = options;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = { clubId };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [prismaTemplates, total] = await Promise.all([
      this.database.trainingTemplate.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: [{ dayOfWeek: 'asc' }, { time: 'asc' }],
      }),
      this.database.trainingTemplate.count({ where }),
    ]);

    const templates = TrainingTemplateMapper.toDomainArray(prismaTemplates);

    return {
      data: templates,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findById(id: string): Promise<TrainingTemplate | null> {
    const prismaTemplate = await this.database.trainingTemplate.findUnique({
      where: { id },
    });

    if (!prismaTemplate) {
      return null;
    }

    return TrainingTemplateMapper.toDomain(prismaTemplate);
  }

  async findActiveTemplates(clubId?: string): Promise<TrainingTemplate[]> {
    const where: Record<string, unknown> = { isActive: true };

    if (clubId) {
      where.clubId = clubId;
    }

    const prismaTemplates = await this.database.trainingTemplate.findMany({
      where,
      orderBy: [{ dayOfWeek: 'asc' }, { time: 'asc' }],
    });

    return TrainingTemplateMapper.toDomainArray(prismaTemplates);
  }

  async findConflictingTemplate(
    clubId: string,
    dayOfWeek: number,
    time: string,
    excludeId?: string,
  ): Promise<TrainingTemplate | null> {
    const where: Record<string, unknown> = {
      clubId,
      dayOfWeek,
      time,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const prismaTemplate = await this.database.trainingTemplate.findFirst({
      where,
    });

    if (!prismaTemplate) {
      return null;
    }

    return TrainingTemplateMapper.toDomain(prismaTemplate);
  }

  async create(
    template: CreateTrainingTemplateData,
  ): Promise<TrainingTemplate> {
    const data = TrainingTemplateMapper.toPrisma(template);

    const prismaTemplate = await this.database.trainingTemplate.create({
      data: data as Parameters<
        typeof this.database.trainingTemplate.create
      >[0]['data'],
    });

    return TrainingTemplateMapper.toDomain(prismaTemplate);
  }

  async update(
    id: string,
    data: UpdateTrainingTemplateData,
  ): Promise<TrainingTemplate> {
    const existingTemplate = await this.database.trainingTemplate.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      throw new NotFoundException(`Training template with ID ${id} not found`);
    }

    const updateData = TrainingTemplateMapper.toPrisma(data);

    const prismaTemplate = await this.database.trainingTemplate.update({
      where: { id },
      data: updateData as Parameters<
        typeof this.database.trainingTemplate.update
      >[0]['data'],
    });

    return TrainingTemplateMapper.toDomain(prismaTemplate);
  }

  async save(template: TrainingTemplate): Promise<TrainingTemplate> {
    const existingTemplate = await this.database.trainingTemplate.findUnique({
      where: { id: template.id },
    });

    if (!existingTemplate) {
      throw new NotFoundException(
        `Training template with ID ${template.id} not found`,
      );
    }

    const updateData = TrainingTemplateMapper.toPrisma({
      clubId: template.clubId,
      title: template.title,
      description: template.description,
      duration: template.duration,
      location: template.location,
      maxParticipants: template.maxParticipants,
      dayOfWeek: template.dayOfWeek,
      time: template.time,
      isActive: template.isActive,
      teamIds: template.teamIds,
    });

    const prismaTemplate = await this.database.trainingTemplate.update({
      where: { id: template.id },
      data: updateData as Parameters<
        typeof this.database.trainingTemplate.update
      >[0]['data'],
    });

    return TrainingTemplateMapper.toDomain(prismaTemplate);
  }

  async delete(id: string): Promise<void> {
    const existingTemplate = await this.database.trainingTemplate.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      throw new NotFoundException(`Training template with ID ${id} not found`);
    }

    await this.database.trainingTemplate.delete({ where: { id } });
  }
}
