import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ITrainingRepository } from '../../../domain/repositories/training.repository.interface';
import { ITrainingRegistrationRepository } from '../../../domain/repositories/training-registration.repository.interface';
import { ITrainingTeamRepository } from '../../../domain/repositories/training-team.repository.interface';
import {
  IUserRepository,
  UserWithSkillsAndAttributes,
} from '../../../domain/repositories/user.repository.interface';
import { TeamGenerationService } from '../../../domain/services/team-generation.service';
import { PlayerLevelCalculationService } from '../../../domain/services/player-level-calculation.service';
import { ParticipantWithLevel } from '../../../domain/value-objects/participant-with-level.value-object';
import { GenerateTrainingTeamsCommand } from './generate-training-teams.command';
import { IUnitOfWork } from '../../../../database/unit-of-work.interface';
import { UNIT_OF_WORK } from '../../../../database/database.module';

@Injectable()
export class GenerateTrainingTeamsHandler {
  private readonly teamGenerationService: TeamGenerationService;
  private readonly playerLevelService: PlayerLevelCalculationService;

  constructor(
    private readonly trainingRepository: ITrainingRepository,
    private readonly registrationRepository: ITrainingRegistrationRepository,
    private readonly teamRepository: ITrainingTeamRepository,
    private readonly userRepository: IUserRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
  ) {
    this.teamGenerationService = new TeamGenerationService();
    this.playerLevelService = new PlayerLevelCalculationService();
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

    const teams = this.teamGenerationService.generateTeams(
      command.trainingId,
      participants,
    );

    return this.unitOfWork.execute(async (tx) => {
      await this.teamRepository.deleteByTrainingId(command.trainingId, tx);

      const createdTeams = await this.teamRepository.createMany(
        teams.map((team) => ({
          trainingId: team.trainingId,
          name: team.name,
          memberIds: team.memberIds,
          averageLevel: team.averageLevel,
        })),
        tx,
      );

      return createdTeams.map((team) => team.id);
    });
  }

  private createParticipantWithLevel(
    user: UserWithSkillsAndAttributes,
  ): ParticipantWithLevel {
    const level = this.playerLevelService.calculateLevel(
      user.skills,
      user.attributes,
    );
    const gender = user.profile?.gender ?? null;

    return new ParticipantWithLevel({
      userId: user.id,
      gender: gender as 'MALE' | 'FEMALE' | null,
      level,
    });
  }
}
