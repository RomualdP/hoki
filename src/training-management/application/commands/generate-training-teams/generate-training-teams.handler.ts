import { Injectable, NotFoundException } from '@nestjs/common';
import { ITrainingRepository } from '../../../domain/repositories/training.repository.interface';
import { ITrainingRegistrationRepository } from '../../../domain/repositories/training-registration.repository.interface';
import { ITrainingTeamRepository } from '../../../domain/repositories/training-team.repository.interface';
import {
  IUserRepository,
  UserWithSkillsAndAttributes,
} from '../../../domain/repositories/user.repository.interface';
import { TeamGenerationService } from '../../../domain/services/team-generation.service';
import { ParticipantWithLevel } from '../../../domain/value-objects/participant-with-level.value-object';
import { GenerateTrainingTeamsCommand } from './generate-training-teams.command';

@Injectable()
export class GenerateTrainingTeamsHandler {
  private readonly teamGenerationService: TeamGenerationService;

  constructor(
    private readonly trainingRepository: ITrainingRepository,
    private readonly registrationRepository: ITrainingRegistrationRepository,
    private readonly teamRepository: ITrainingTeamRepository,
    private readonly userRepository: IUserRepository,
  ) {
    this.teamGenerationService = new TeamGenerationService();
  }

  async execute(command: GenerateTrainingTeamsCommand): Promise<string[]> {
    const training = await this.trainingRepository.findById(command.trainingId);

    if (!training) {
      throw new NotFoundException(
        `Entraînement avec l'ID ${command.trainingId} non trouvé`,
      );
    }

    const registrations = await this.registrationRepository.findByTrainingId({
      trainingId: command.trainingId,
      status: 'CONFIRMED',
    });

    if (registrations.length === 0) {
      throw new Error('Aucun participant confirmé pour cet entraînement');
    }

    const userIds = registrations.map((reg) => reg.userId);

    const users = await this.userRepository.findManyByIdsWithDetails(userIds);

    const participants = users.map((user) =>
      this.createParticipantWithLevel(user),
    );

    await this.teamRepository.deleteByTrainingId(command.trainingId);

    const teams = this.teamGenerationService.generateTeams(
      command.trainingId,
      participants,
    );

    const createdTeams = await this.teamRepository.createMany(
      teams.map((team) => ({
        trainingId: team.trainingId,
        name: team.name,
        memberIds: team.memberIds,
        averageLevel: team.averageLevel,
      })),
    );

    return createdTeams.map((team) => team.id);
  }

  private createParticipantWithLevel(
    user: UserWithSkillsAndAttributes,
  ): ParticipantWithLevel {
    const level = this.calculatePlayerLevel(user.skills, user.attributes);
    const gender = user.profile?.gender ?? null;

    return new ParticipantWithLevel({
      userId: user.id,
      gender: gender as 'MALE' | 'FEMALE' | null,
      level,
    });
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
