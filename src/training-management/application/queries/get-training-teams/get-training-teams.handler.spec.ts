import { GetTrainingTeamsHandler } from './get-training-teams.handler';
import { GetTrainingTeamsQuery } from './get-training-teams.query';
import { ITrainingTeamRepository } from '../../../domain/repositories/training-team.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { TrainingTeam } from '../../../domain/entities/training-team.entity';
import { createMockUser } from '../../../__tests__/factories';

describe('GetTrainingTeamsHandler', () => {
  let handler: GetTrainingTeamsHandler;
  let teamRepository: jest.Mocked<ITrainingTeamRepository>;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    teamRepository = {
      findByTrainingId: jest.fn(),
    } as unknown as jest.Mocked<ITrainingTeamRepository>;

    userRepository = {
      findManyByIdsWithFullProfile: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    handler = new GetTrainingTeamsHandler(teamRepository, userRepository);
  });

  describe('execute', () => {
    it('should retrieve teams with calculated player levels', async () => {
      const mockTeams = [
        new TrainingTeam({
          id: 'team-1',
          trainingId: 'training-1',
          name: 'Équipe 1',
          memberIds: ['user-1', 'user-2', 'user-4', 'user-5'],
          averageLevel: 10,
          createdAt: new Date(),
        }),
        new TrainingTeam({
          id: 'team-2',
          trainingId: 'training-1',
          name: 'Équipe 2',
          memberIds: ['user-3', 'user-6', 'user-7', 'user-8'],
          averageLevel: 8,
          createdAt: new Date(),
        }),
      ];

      const mockUsers = [
        createMockUser({
          id: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
          skills: [{ level: 5 }, { level: 3 }],
          attributes: [
            { attribute: 'FITNESS', value: 1.2 },
            { attribute: 'LEADERSHIP', value: 1.0 },
          ],
        }),
        createMockUser({
          id: 'user-2',
          firstName: 'Jane',
          lastName: 'Smith',
          profile: { gender: 'FEMALE' },
          skills: [{ level: 4 }, { level: 4 }],
          attributes: [
            { attribute: 'FITNESS', value: 1.0 },
            { attribute: 'LEADERSHIP', value: 1.5 },
          ],
        }),
        createMockUser({
          id: 'user-3',
          firstName: 'Bob',
          lastName: 'Johnson',
          skills: [{ level: 6 }],
          attributes: [],
        }),
      ];

      const query = new GetTrainingTeamsQuery();
      query.trainingId = 'training-1';

      teamRepository.findByTrainingId.mockResolvedValue(mockTeams);
      userRepository.findManyByIdsWithFullProfile.mockResolvedValue(mockUsers);

      const result = await handler.execute(query);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('team-1');
      expect(result[0].members.length).toBeGreaterThanOrEqual(2);
      const user1 = result[0].members.find((m) => m.userId === 'user-1');
      const user2 = result[0].members.find((m) => m.userId === 'user-2');
      expect(user1?.level).toBe(9.6);
      expect(user2?.level).toBe(12);
    });

    it('should filter out members not found in userMap', async () => {
      const mockTeams = [
        new TrainingTeam({
          id: 'team-1',
          trainingId: 'training-1',
          name: 'Équipe 1',
          memberIds: ['user-1', 'user-missing', 'user-2', 'user-3', 'user-4'],
          averageLevel: 10,
          createdAt: new Date(),
        }),
      ];

      const mockUsers = [
        createMockUser({ id: 'user-1' }),
        createMockUser({ id: 'user-2' }),
        createMockUser({ id: 'user-3' }),
        createMockUser({ id: 'user-4' }),
      ];

      const query = new GetTrainingTeamsQuery();
      query.trainingId = 'training-1';

      teamRepository.findByTrainingId.mockResolvedValue(mockTeams);
      userRepository.findManyByIdsWithFullProfile.mockResolvedValue(mockUsers);

      const result = await handler.execute(query);

      expect(result[0].members).toHaveLength(4);
      expect(
        result[0].members.find((m) => m.userId === 'user-missing'),
      ).toBeUndefined();
    });
  });
});
