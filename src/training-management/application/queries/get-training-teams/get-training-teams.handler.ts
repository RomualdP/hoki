import { Injectable } from '@nestjs/common';
import { ITrainingTeamRepository } from '../../../domain/repositories/training-team.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import {
  TrainingTeamReadModel,
  TeamMemberReadModel,
} from '../../read-models/training-team.read-model';
import { GetTrainingTeamsQuery } from './get-training-teams.query';

@Injectable()
export class GetTrainingTeamsHandler {
  constructor(
    private readonly teamRepository: ITrainingTeamRepository,
    private readonly userRepository: IUserRepository,
  ) {}

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
        const level = this.calculatePlayerLevel(user.skills, user.attributes);
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

  private calculatePlayerLevel(
    skills: Array<{ level: number }>,
    attributes: Array<{ attribute: string; value: number }>,
  ): number {
    const DEFAULT_FITNESS_COEFFICIENT = 1.0;
    const DEFAULT_LEADERSHIP_COEFFICIENT = 1.0;

    const skillsSum = skills.reduce((sum, skill) => sum + skill.level, 0);

    const fitnessAttr = attributes.find((attr) => attr.attribute === 'FITNESS');
    const leadershipAttr = attributes.find(
      (attr) => attr.attribute === 'LEADERSHIP',
    );

    const fitnessCoefficient =
      fitnessAttr?.value ?? DEFAULT_FITNESS_COEFFICIENT;
    const leadershipCoefficient =
      leadershipAttr?.value ?? DEFAULT_LEADERSHIP_COEFFICIENT;

    return skillsSum * fitnessCoefficient * leadershipCoefficient;
  }
}
