import { TrainingTemplate as PrismaTrainingTemplate } from '@prisma/client';
import {
  TrainingTemplate,
  TrainingTemplateProps,
} from '../../../domain/entities/training-template.entity';

export class TrainingTemplateMapper {
  static toDomain(prismaTemplate: PrismaTrainingTemplate): TrainingTemplate {
    const props: TrainingTemplateProps = {
      id: prismaTemplate.id,
      clubId: prismaTemplate.clubId,
      title: prismaTemplate.title,
      description: prismaTemplate.description,
      duration: prismaTemplate.duration,
      location: prismaTemplate.location,
      maxParticipants: prismaTemplate.maxParticipants,
      dayOfWeek: prismaTemplate.dayOfWeek,
      time: prismaTemplate.time,
      isActive: prismaTemplate.isActive,
      teamIds: prismaTemplate.teamIds,
      createdAt: prismaTemplate.createdAt,
      updatedAt: prismaTemplate.updatedAt,
    };

    return new TrainingTemplate(props);
  }

  static toDomainArray(
    prismaTemplates: PrismaTrainingTemplate[],
  ): TrainingTemplate[] {
    return prismaTemplates.map((prismaTemplate) =>
      this.toDomain(prismaTemplate),
    );
  }

  static toPrismaFromEntity(
    template: TrainingTemplate,
  ): Omit<PrismaTrainingTemplate, 'id' | 'createdAt' | 'updatedAt'> {
    return {
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
    };
  }

  static toPrisma(
    data: Partial<{
      clubId: string;
      title: string;
      description: string | null;
      duration: number;
      location: string | null;
      maxParticipants: number | null;
      dayOfWeek: number;
      time: string;
      isActive: boolean;
      teamIds: string[];
    }>,
  ): Partial<Omit<PrismaTrainingTemplate, 'id' | 'createdAt' | 'updatedAt'>> {
    const result: Partial<
      Omit<PrismaTrainingTemplate, 'id' | 'createdAt' | 'updatedAt'>
    > = {};

    if (data.clubId !== undefined) {
      result.clubId = data.clubId;
    }
    if (data.title !== undefined) {
      result.title = data.title;
    }
    if (data.description !== undefined) {
      result.description = data.description;
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
    if (data.dayOfWeek !== undefined) {
      result.dayOfWeek = data.dayOfWeek;
    }
    if (data.time !== undefined) {
      result.time = data.time;
    }
    if (data.isActive !== undefined) {
      result.isActive = data.isActive;
    }
    if (data.teamIds !== undefined) {
      result.teamIds = data.teamIds;
    }

    return result;
  }
}
