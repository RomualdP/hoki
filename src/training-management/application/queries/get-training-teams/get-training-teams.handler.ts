import { Injectable } from '@nestjs/common';
import { ITrainingTeamRepository } from '../../../domain/repositories/training-team.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { PlayerLevelCalculationService } from '../../../domain/services/player-level-calculation.service';
import {
  TrainingTeamReadModel,
  TeamMemberReadModel,
} from '../../read-models/training-team.read-model';
import { GetTrainingTeamsQuery } from './get-training-teams.query';

@Injectable()
export class GetTrainingTeamsHandler {
  private readonly playerLevelService: PlayerLevelCalculationService;

  constructor(
    private readonly teamRepository: ITrainingTeamRepository,
    private readonly userRepository: IUserRepository,
  ) {
    this.playerLevelService = new PlayerLevelCalculationService();
  }

  async execute(
    query: GetTrainingTeamsQuery,
  ): Promise<TrainingTeamReadModel[]> {
    const teams = await this.teamRepository.findByTrainingId(query.trainingId);

    const allMemberIds = teams.flatMap((team) => team.memberIds);
    const uniqueMemberIds = [...new Set(allMemberIds)];

    const users =
      await this.userRepository.findManyByIdsWithFullProfile(uniqueMemberIds);

    const userMap = new Map(
      users.map((user) => {
        const level = this.playerLevelService.calculateLevel(
          user.skills,
          user.attributes,
        );
        return [
          user.id,
          {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            gender: user.profile?.gender ?? null,
            level,
          } as TeamMemberReadModel,
        ];
      }),
    );

    return teams.map((team) => ({
      id: team.id,
      trainingId: team.trainingId,
      name: team.name,
      averageLevel: team.averageLevel,
      members: team.memberIds
        .map((memberId) => userMap.get(memberId))
        .filter(
          (member): member is TeamMemberReadModel => member !== undefined,
        ),
      createdAt: team.createdAt,
    }));
  }
}
