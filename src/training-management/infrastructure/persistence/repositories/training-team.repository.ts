import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import {
  ITrainingTeamRepository,
  CreateTrainingTeamData,
} from '../../../domain/repositories/training-team.repository.interface';
import { TrainingTeam } from '../../../domain/entities/training-team.entity';
import { TrainingTeamMapper } from '../mappers/training-team.mapper';

@Injectable()
export class TrainingTeamRepository implements ITrainingTeamRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreateTrainingTeamData): Promise<TrainingTeam> {
    const trainingTeam = await this.db.trainingTeam.create({
      data: {
        trainingId: data.trainingId,
        name: data.name,
        memberIds: data.memberIds,
        averageLevel: data.averageLevel,
      },
    });

    return TrainingTeamMapper.toDomain(trainingTeam);
  }

  async createMany(data: CreateTrainingTeamData[]): Promise<TrainingTeam[]> {
    const createdTeams = await Promise.all(
      data.map((teamData) => this.create(teamData)),
    );

    return createdTeams;
  }

  async findByTrainingId(trainingId: string): Promise<TrainingTeam[]> {
    const trainingTeams = await this.db.trainingTeam.findMany({
      where: { trainingId },
      orderBy: { createdAt: 'asc' },
    });

    return TrainingTeamMapper.toDomainMany(trainingTeams);
  }

  async findById(id: string): Promise<TrainingTeam | null> {
    const trainingTeam = await this.db.trainingTeam.findUnique({
      where: { id },
    });

    if (!trainingTeam) {
      return null;
    }

    return TrainingTeamMapper.toDomain(trainingTeam);
  }

  async deleteByTrainingId(trainingId: string): Promise<void> {
    await this.db.trainingTeam.deleteMany({
      where: { trainingId },
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.trainingTeam.delete({
      where: { id },
    });
  }

  async existsForTraining(trainingId: string): Promise<boolean> {
    const count = await this.db.trainingTeam.count({
      where: { trainingId },
    });

    return count > 0;
  }
}
