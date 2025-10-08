import { TrainingTeam as PrismaTrainingTeam } from '@prisma/client';
import { TrainingTeam } from '../../../domain/entities/training-team.entity';

export class TrainingTeamMapper {
  static toDomain(prismaTeam: PrismaTrainingTeam): TrainingTeam {
    return new TrainingTeam({
      id: prismaTeam.id,
      trainingId: prismaTeam.trainingId,
      name: prismaTeam.name,
      memberIds: prismaTeam.memberIds,
      averageLevel: prismaTeam.averageLevel,
      createdAt: prismaTeam.createdAt,
    });
  }

  static toDomainMany(prismaTeams: PrismaTrainingTeam[]): TrainingTeam[] {
    return prismaTeams.map((team) => this.toDomain(team));
  }

  static toPrisma(team: TrainingTeam): PrismaTrainingTeam {
    return {
      id: team.id,
      trainingId: team.trainingId,
      name: team.name,
      memberIds: team.memberIds,
      averageLevel: team.averageLevel,
      createdAt: team.createdAt,
    };
  }
}
