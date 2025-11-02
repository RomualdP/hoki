import { Injectable } from '@nestjs/common';
import { ITrainingTemplateRepository } from '../../../domain/repositories/training-template.repository.interface';
import { ListTrainingTemplatesQuery } from './list-training-templates.query';

@Injectable()
export class ListTrainingTemplatesHandler {
  constructor(
    private readonly trainingTemplateRepository: ITrainingTemplateRepository,
  ) {}

  async execute(
    query: ListTrainingTemplatesQuery,
  ): Promise<
    Array<{
      id: string;
      title: string;
      description: string | null;
      duration: number;
      location: string | null;
      maxParticipants: number | null;
      dayOfWeek: number;
      time: string;
      isActive: boolean;
      teamIds: string[];
      createdAt: Date;
      updatedAt: Date;
    }>
  > {
    const templates =
      await this.trainingTemplateRepository.findByClubId(query.clubId);

    return templates.map((template) => ({
      id: template.id,
      title: template.title,
      description: template.description,
      duration: template.duration,
      location: template.location,
      maxParticipants: template.maxParticipants,
      dayOfWeek: template.dayOfWeek,
      time: template.time,
      isActive: template.isActive,
      teamIds: template.teamIds,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    }));
  }
}

