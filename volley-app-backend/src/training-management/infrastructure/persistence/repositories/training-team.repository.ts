import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import { PrismaTransactionClient } from '../../../../database/unit-of-work.interface';
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

  async createMany(
    data: CreateTrainingTeamData[],
    tx?: PrismaTransactionClient,
  ): Promise<TrainingTeam[]> {
    const client = tx ?? this.db;
    const createdTeams = await Promise.all(
      data.map(async (teamData) => {
        const trainingTeam = await client.trainingTeam.create({
          data: {
            trainingId: teamData.trainingId,
            name: teamData.name,
            memberIds: teamData.memberIds,
            averageLevel: teamData.averageLevel,
          },
        });
        return TrainingTeamMapper.toDomain(trainingTeam);
      }),
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

  async deleteByTrainingId(
    trainingId: string,
    tx?: PrismaTransactionClient,
  ): Promise<void> {
    const client = tx ?? this.db;
    await client.trainingTeam.deleteMany({
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
