import { TeamGenerationService } from './team-generation.service';
import { ParticipantWithLevel } from '../value-objects/participant-with-level.value-object';

describe('TeamGenerationService', () => {
  let service: TeamGenerationService;
  const trainingId = 'training-123';

  beforeEach(() => {
    service = new TeamGenerationService();
  });

  describe('generateTeams', () => {
    it('should throw error if less than 4 participants', () => {
      const participants: ParticipantWithLevel[] = [
        new ParticipantWithLevel({ userId: '1', gender: 'MALE', level: 50 }),
        new ParticipantWithLevel({ userId: '2', gender: 'MALE', level: 60 }),
        new ParticipantWithLevel({ userId: '3', gender: 'FEMALE', level: 55 }),
      ];

      expect(() => service.generateTeams(trainingId, participants)).toThrow(
        'Nombre insuffisant de participants',
      );
    });

    it('should create balanced teams with 12 participants', () => {
      const participants: ParticipantWithLevel[] = [
        new ParticipantWithLevel({ userId: '1', gender: 'FEMALE', level: 90 }),
        new ParticipantWithLevel({ userId: '2', gender: 'FEMALE', level: 70 }),
        new ParticipantWithLevel({ userId: '3', gender: 'FEMALE', level: 60 }),
        new ParticipantWithLevel({ userId: '4', gender: 'FEMALE', level: 50 }),
        new ParticipantWithLevel({ userId: '5', gender: 'MALE', level: 85 }),
        new ParticipantWithLevel({ userId: '6', gender: 'MALE', level: 75 }),
        new ParticipantWithLevel({ userId: '7', gender: 'MALE', level: 65 }),
        new ParticipantWithLevel({ userId: '8', gender: 'MALE', level: 55 }),
        new ParticipantWithLevel({ userId: '9', gender: 'MALE', level: 80 }),
        new ParticipantWithLevel({ userId: '10', gender: 'MALE', level: 70 }),
        new ParticipantWithLevel({ userId: '11', gender: 'FEMALE', level: 65 }),
        new ParticipantWithLevel({ userId: '12', gender: 'FEMALE', level: 55 }),
      ];

      const teams = service.generateTeams(trainingId, participants);

      expect(teams).toHaveLength(3);
      teams.forEach((team) => {
        expect(team.getSize()).toBeGreaterThanOrEqual(4);
        expect(team.getSize()).toBeLessThanOrEqual(6);
        expect(team.trainingId).toBe(trainingId);
      });

      const allMemberIds = teams.flatMap((team) => team.memberIds);
      expect(allMemberIds).toHaveLength(12);
      expect(new Set(allMemberIds).size).toBe(12);
    });

    it('should distribute female players first by level across teams', () => {
      const participants: ParticipantWithLevel[] = [
        new ParticipantWithLevel({ userId: 'f1', gender: 'FEMALE', level: 90 }),
        new ParticipantWithLevel({ userId: 'f2', gender: 'FEMALE', level: 80 }),
        new ParticipantWithLevel({ userId: 'f3', gender: 'FEMALE', level: 70 }),
        new ParticipantWithLevel({ userId: 'm1', gender: 'MALE', level: 85 }),
        new ParticipantWithLevel({ userId: 'm2', gender: 'MALE', level: 75 }),
        new ParticipantWithLevel({ userId: 'm3', gender: 'MALE', level: 65 }),
        new ParticipantWithLevel({ userId: 'm4', gender: 'MALE', level: 55 }),
        new ParticipantWithLevel({ userId: 'm5', gender: 'MALE', level: 45 }),
      ];

      const teams = service.generateTeams(trainingId, participants);

      expect(teams).toHaveLength(2);

      const femaleDistribution = teams.map(
        (team) => team.memberIds.filter((id) => id.startsWith('f')).length,
      );

      expect(femaleDistribution.every((count) => count >= 1)).toBe(true);
    });

    it('should handle participants without gender', () => {
      const participants: ParticipantWithLevel[] = [
        new ParticipantWithLevel({ userId: '1', gender: null, level: 90 }),
        new ParticipantWithLevel({ userId: '2', gender: null, level: 80 }),
        new ParticipantWithLevel({ userId: '3', gender: null, level: 70 }),
        new ParticipantWithLevel({ userId: '4', gender: null, level: 60 }),
        new ParticipantWithLevel({ userId: '5', gender: null, level: 50 }),
      ];

      const teams = service.generateTeams(trainingId, participants);

      expect(teams).toHaveLength(1);
      expect(teams[0].getSize()).toBe(5);
    });

    it('should create teams with balanced average levels', () => {
      const participants: ParticipantWithLevel[] = [
        new ParticipantWithLevel({ userId: '1', gender: 'MALE', level: 100 }),
        new ParticipantWithLevel({ userId: '2', gender: 'MALE', level: 90 }),
        new ParticipantWithLevel({ userId: '3', gender: 'MALE', level: 80 }),
        new ParticipantWithLevel({ userId: '4', gender: 'MALE', level: 70 }),
        new ParticipantWithLevel({ userId: '5', gender: 'MALE', level: 60 }),
        new ParticipantWithLevel({ userId: '6', gender: 'MALE', level: 50 }),
        new ParticipantWithLevel({ userId: '7', gender: 'MALE', level: 40 }),
        new ParticipantWithLevel({ userId: '8', gender: 'MALE', level: 30 }),
        new ParticipantWithLevel({ userId: '9', gender: 'MALE', level: 20 }),
        new ParticipantWithLevel({ userId: '10', gender: 'MALE', level: 10 }),
      ];

      const teams = service.generateTeams(trainingId, participants);

      const averageLevels = teams.map((team) => team.averageLevel);
      const maxDifference =
        Math.max(...averageLevels) - Math.min(...averageLevels);

      expect(maxDifference).toBeLessThan(30);
    });

    it('should handle unbalanced gender distribution', () => {
      const participants: ParticipantWithLevel[] = [
        new ParticipantWithLevel({ userId: 'f1', gender: 'FEMALE', level: 90 }),
        new ParticipantWithLevel({ userId: 'f2', gender: 'FEMALE', level: 80 }),
        new ParticipantWithLevel({ userId: 'f3', gender: 'FEMALE', level: 70 }),
        new ParticipantWithLevel({ userId: 'f4', gender: 'FEMALE', level: 60 }),
        new ParticipantWithLevel({ userId: 'f5', gender: 'FEMALE', level: 50 }),
        new ParticipantWithLevel({ userId: 'f6', gender: 'FEMALE', level: 40 }),
        new ParticipantWithLevel({ userId: 'f7', gender: 'FEMALE', level: 30 }),
        new ParticipantWithLevel({ userId: 'f8', gender: 'FEMALE', level: 20 }),
        new ParticipantWithLevel({ userId: 'm1', gender: 'MALE', level: 85 }),
        new ParticipantWithLevel({ userId: 'm2', gender: 'MALE', level: 75 }),
        new ParticipantWithLevel({ userId: 'm3', gender: 'MALE', level: 65 }),
        new ParticipantWithLevel({ userId: 'm4', gender: 'MALE', level: 55 }),
      ];

      const teams = service.generateTeams(trainingId, participants);

      expect(teams.length).toBeGreaterThan(0);

      const allMemberIds = teams.flatMap((team) => team.memberIds);
      expect(allMemberIds).toHaveLength(12);
    });

    it('should create exactly 4 teams for 20 participants', () => {
      const participants: ParticipantWithLevel[] = Array.from(
        { length: 20 },
        (_, i) =>
          new ParticipantWithLevel({
            userId: `user-${i}`,
            gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
            level: 50 + i,
          }),
      );

      const teams = service.generateTeams(trainingId, participants);

      expect(teams).toHaveLength(4);
      teams.forEach((team) => {
        expect(team.getSize()).toBeGreaterThanOrEqual(4);
        expect(team.getSize()).toBeLessThanOrEqual(6);
      });

      const totalMembers = teams.reduce((sum, team) => sum + team.getSize(), 0);
      expect(totalMembers).toBe(20);
    });

    it('should set correct team names', () => {
      const participants: ParticipantWithLevel[] = Array.from(
        { length: 12 },
        (_, i) =>
          new ParticipantWithLevel({
            userId: `user-${i}`,
            gender: 'MALE',
            level: 50,
          }),
      );

      const teams = service.generateTeams(trainingId, participants);

      expect(teams[0].name).toBe('Équipe 1');
      expect(teams[1].name).toBe('Équipe 2');
      expect(teams[2].name).toBe('Équipe 3');
    });

    it('should assign unique IDs to each team', () => {
      const participants: ParticipantWithLevel[] = Array.from(
        { length: 10 },
        (_, i) =>
          new ParticipantWithLevel({
            userId: `user-${i}`,
            gender: 'MALE',
            level: 50,
          }),
      );

      const teams = service.generateTeams(trainingId, participants);

      const teamIds = teams.map((team) => team.id);
      expect(new Set(teamIds).size).toBe(teamIds.length);
    });
  });
});
