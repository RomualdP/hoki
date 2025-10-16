import { TrainingTeam } from '../entities/training-team.entity';
import { PrismaTransactionClient } from '../../../database/unit-of-work.interface';

export interface CreateTrainingTeamData {
  trainingId: string;
  name: string;
  memberIds: string[];
  averageLevel: number;
}

export interface ITrainingTeamRepository {
  create(data: CreateTrainingTeamData): Promise<TrainingTeam>;
  createMany(
    data: CreateTrainingTeamData[],
    tx?: PrismaTransactionClient,
  ): Promise<TrainingTeam[]>;
  findByTrainingId(trainingId: string): Promise<TrainingTeam[]>;
  findById(id: string): Promise<TrainingTeam | null>;
  deleteByTrainingId(
    trainingId: string,
    tx?: PrismaTransactionClient,
  ): Promise<void>;
  delete(id: string): Promise<void>;
  existsForTraining(trainingId: string): Promise<boolean>;
}
