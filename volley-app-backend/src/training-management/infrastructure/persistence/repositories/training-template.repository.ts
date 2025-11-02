import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import {
  CreateTrainingTemplateData,
  ITrainingTemplateRepository,
  UpdateTrainingTemplateData,
} from '../../../domain/repositories/training-template.repository.interface';
import { TrainingTemplate } from '../../../domain/entities/training-template.entity';
import { TrainingTemplateMapper } from '../mappers/training-template.mapper';

@Injectable()
export class TrainingTemplateRepository
  implements ITrainingTemplateRepository
{
  constructor(private readonly database: DatabaseService) {}

  async findByClubId(clubId: string): Promise<TrainingTemplate[]> {
    const prismaTemplates = await this.database.trainingTemplate.findMany({
      where: { clubId },
      orderBy: { createdAt: 'desc' },
    });

    return TrainingTemplateMapper.toDomainArray(prismaTemplates);
  }

  async findById(id: string): Promise<TrainingTemplate | null> {
    const prismaTemplate =
      await this.database.trainingTemplate.findUnique({
        where: { id },
      });

    if (!prismaTemplate) {
      return null;
    }

    return TrainingTemplateMapper.toDomain(prismaTemplate);
  }

  async create(
    data: CreateTrainingTemplateData,
  ): Promise<TrainingTemplate> {
    const prismaData = TrainingTemplateMapper.toPrisma(data);

    const prismaTemplate =
      await this.database.trainingTemplate.create({
        data: prismaData as Parameters<
          typeof this.database.trainingTemplate.create
        >[0]['data'],
      });

    return TrainingTemplateMapper.toDomain(prismaTemplate);
  }

  async update(
    id: string,
    data: UpdateTrainingTemplateData,
  ): Promise<TrainingTemplate> {
    const existingTemplate =
      await this.database.trainingTemplate.findUnique({
        where: { id },
      });

    if (!existingTemplate) {
      throw new NotFoundException(
        `Training template with ID ${id} not found`,
      );
    }

    const updateData = TrainingTemplateMapper.toPrisma(data);

    const prismaTemplate =
      await this.database.trainingTemplate.update({
        where: { id },
        data: updateData as Parameters<
          typeof this.database.trainingTemplate.update
        >[0]['data'],
      });

    return TrainingTemplateMapper.toDomain(prismaTemplate);
  }

  async save(template: TrainingTemplate): Promise<TrainingTemplate> {
    const existingTemplate =
      await this.database.trainingTemplate.findUnique({
        where: { id: template.id },
      });

    if (!existingTemplate) {
      throw new NotFoundException(
        `Training template with ID ${template.id} not found`,
      );
    }

    const updateData = TrainingTemplateMapper.toPrisma({
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

    const prismaTemplate =
      await this.database.trainingTemplate.update({
        where: { id: template.id },
        data: updateData as Parameters<
          typeof this.database.trainingTemplate.update
        >[0]['data'],
      });

    return TrainingTemplateMapper.toDomain(prismaTemplate);
  }

  async delete(id: string): Promise<void> {
    const existingTemplate =
      await this.database.trainingTemplate.findUnique({
        where: { id },
      });

    if (!existingTemplate) {
      throw new NotFoundException(
        `Training template with ID ${id} not found`,
      );
    }

    await this.database.trainingTemplate.delete({ where: { id } });
  }

  async findActiveByClubId(
    clubId: string,
  ): Promise<TrainingTemplate[]> {
    const prismaTemplates = await this.database.trainingTemplate.findMany({
      where: {
        clubId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return TrainingTemplateMapper.toDomainArray(prismaTemplates);
  }
}

