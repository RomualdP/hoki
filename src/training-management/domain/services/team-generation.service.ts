import { randomUUID } from 'crypto';
import { TrainingTeam } from '../entities/training-team.entity';
import { ParticipantWithLevel } from '../value-objects/participant-with-level.value-object';
import { TeamSize } from '../value-objects/team-size.value-object';

export class TeamGenerationService {
  generateTeams(
    trainingId: string,
    participants: ParticipantWithLevel[],
  ): TrainingTeam[] {
    if (participants.length < TeamSize.min) {
      throw new Error(
        `Nombre insuffisant de participants pour créer des équipes (minimum ${TeamSize.min})`,
      );
    }

    const numberOfTeams = this.calculateOptimalTeamCount(participants.length);
    const teams: TeamWithMembers[] = this.initializeTeams(
      trainingId,
      numberOfTeams,
    );

    const { femaleParticipants, maleParticipants, unknownGenderParticipants } =
      this.groupParticipantsByGender(participants);

    this.distributeByGenderAndLevel(teams, femaleParticipants);
    this.distributeByGenderAndLevel(teams, maleParticipants);
    this.distributeByLevel(teams, unknownGenderParticipants);

    return teams.map((team) => this.createTrainingTeam(team));
  }

  private calculateOptimalTeamCount(participantCount: number): number {
    const idealTeamSize = 5;
    const numberOfTeams = Math.ceil(participantCount / idealTeamSize);
    const averageTeamSize = participantCount / numberOfTeams;

    if (averageTeamSize < TeamSize.min) {
      return Math.floor(participantCount / TeamSize.min);
    }

    return numberOfTeams;
  }

  private initializeTeams(
    trainingId: string,
    count: number,
  ): TeamWithMembers[] {
    return Array.from({ length: count }, (_, index) => ({
      id: randomUUID(),
      trainingId,
      name: `Équipe ${index + 1}`,
      members: [],
      createdAt: new Date(),
    }));
  }

  private groupParticipantsByGender(participants: ParticipantWithLevel[]): {
    femaleParticipants: ParticipantWithLevel[];
    maleParticipants: ParticipantWithLevel[];
    unknownGenderParticipants: ParticipantWithLevel[];
  } {
    const femaleParticipants: ParticipantWithLevel[] = [];
    const maleParticipants: ParticipantWithLevel[] = [];
    const unknownGenderParticipants: ParticipantWithLevel[] = [];

    participants.forEach((participant) => {
      if (participant.isFemale()) {
        femaleParticipants.push(participant);
      } else if (participant.isMale()) {
        maleParticipants.push(participant);
      } else {
        unknownGenderParticipants.push(participant);
      }
    });

    return { femaleParticipants, maleParticipants, unknownGenderParticipants };
  }

  private distributeByGenderAndLevel(
    teams: TeamWithMembers[],
    participants: ParticipantWithLevel[],
  ): void {
    if (participants.length === 0) {
      return;
    }

    const sortedParticipants = this.sortByLevelDescending(participants);
    this.distributeSerpentine(teams, sortedParticipants);
  }

  private distributeByLevel(
    teams: TeamWithMembers[],
    participants: ParticipantWithLevel[],
  ): void {
    if (participants.length === 0) {
      return;
    }

    const sortedParticipants = this.sortByLevelDescending(participants);

    sortedParticipants.forEach((participant) => {
      const smallestTeam = this.findSmallestTeam(teams);
      smallestTeam.members.push(participant);
    });
  }

  private distributeSerpentine(
    teams: TeamWithMembers[],
    participants: ParticipantWithLevel[],
  ): void {
    let teamIndex = 0;
    let direction = 1;

    participants.forEach((participant) => {
      teams[teamIndex].members.push(participant);

      teamIndex += direction;

      if (teamIndex >= teams.length) {
        teamIndex = teams.length - 1;
        direction = -1;
      } else if (teamIndex < 0) {
        teamIndex = 0;
        direction = 1;
      }
    });
  }

  private sortByLevelDescending(
    participants: ParticipantWithLevel[],
  ): ParticipantWithLevel[] {
    return [...participants].sort((a, b) => b.level - a.level);
  }

  private findSmallestTeam(teams: TeamWithMembers[]): TeamWithMembers {
    return teams.reduce((smallest, current) =>
      current.members.length < smallest.members.length ? current : smallest,
    );
  }

  private createTrainingTeam(team: TeamWithMembers): TrainingTeam {
    const memberIds = team.members.map((member) => member.userId);
    const averageLevel = this.calculateAverageLevel(team.members);

    return new TrainingTeam({
      id: team.id,
      trainingId: team.trainingId,
      name: team.name,
      memberIds,
      averageLevel,
      createdAt: team.createdAt,
    });
  }

  private calculateAverageLevel(participants: ParticipantWithLevel[]): number {
    if (participants.length === 0) {
      return 0;
    }

    const totalLevel = participants.reduce(
      (sum, participant) => sum + participant.level,
      0,
    );

    return Math.round((totalLevel / participants.length) * 100) / 100;
  }
}

interface TeamWithMembers {
  id: string;
  trainingId: string;
  name: string;
  members: ParticipantWithLevel[];
  createdAt: Date;
}
