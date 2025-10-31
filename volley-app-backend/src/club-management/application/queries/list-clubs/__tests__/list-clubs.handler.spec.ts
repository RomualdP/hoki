import { Test, TestingModule } from '@nestjs/testing';
import { ListClubsHandler } from '../list-clubs.handler';
import { ListClubsQuery } from '../list-clubs.query';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../../domain/repositories/club.repository';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../../domain/repositories/member.repository';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../../domain/repositories/subscription.repository';
import { Club } from '../../../../domain/entities/club.entity';

describe('ListClubsHandler', () => {
  let handler: ListClubsHandler;
  let clubRepository: jest.Mocked<IClubRepository>;
  let memberRepository: jest.Mocked<IMemberRepository>;
  let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;

  beforeEach(async () => {
    const mockClubRepository: jest.Mocked<IClubRepository> = {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByOwnerId: jest.fn(),
      findAll: jest.fn(),
      existsByName: jest.fn(),
      getAllClubNames: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    const mockMemberRepository: jest.Mocked<IMemberRepository> = {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByUserIdAndClubId: jest.fn(),
      findByClubId: jest.fn(),
      findActiveByClubId: jest.fn(),
      findByClubIdAndRole: jest.fn(),
      findActiveByClubIdAndRole: jest.fn(),
      findByUserId: jest.fn(),
      findActiveByUserId: jest.fn(),
      findByInviterId: jest.fn(),
      existsByUserIdAndClubId: jest.fn(),
      delete: jest.fn(),
      countByClubId: jest.fn(),
      countActiveByClubId: jest.fn(),
      countByClubIdAndRole: jest.fn(),
    };

    const mockSubscriptionRepository: jest.Mocked<ISubscriptionRepository> = {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByClubId: jest.fn(),
      findByStripeSubscriptionId: jest.fn(),
      findByStripeCustomerId: jest.fn(),
      findByPlanId: jest.fn(),
      findAllActive: jest.fn(),
      findExpiringSubscriptions: jest.fn(),
      findCanceledButActive: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      countByPlanId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListClubsHandler,
        {
          provide: CLUB_REPOSITORY,
          useValue: mockClubRepository,
        },
        {
          provide: MEMBER_REPOSITORY,
          useValue: mockMemberRepository,
        },
        {
          provide: SUBSCRIPTION_REPOSITORY,
          useValue: mockSubscriptionRepository,
        },
      ],
    }).compile();

    handler = module.get<ListClubsHandler>(ListClubsHandler);
    clubRepository = module.get(CLUB_REPOSITORY);
    memberRepository = module.get(MEMBER_REPOSITORY);
    subscriptionRepository = module.get(SUBSCRIPTION_REPOSITORY);
  });

  describe('execute()', () => {
    it('should return list of clubs successfully', async () => {
      const query = new ListClubsQuery();

      const mockClubs: Club[] = [
        Club.create({
          id: 'club-1',
          name: 'Volleyball Club A',
          ownerId: 'user-1',
          description: 'First club',
          location: 'Paris',
          logo: 'logo1.jpg',
        }),
        Club.create({
          id: 'club-2',
          name: 'Volleyball Club B',
          ownerId: 'user-2',
          description: 'Second club',
          location: 'Lyon',
          logo: 'logo2.jpg',
        }),
      ];

      clubRepository.findAll.mockResolvedValue(mockClubs);
      memberRepository.countByClubId.mockResolvedValue(5);
      subscriptionRepository.findByClubId.mockResolvedValue(null);

      const result = await handler.execute(query);

      expect(clubRepository.findAll).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
        searchTerm: undefined,
      });
      expect(memberRepository.countByClubId).toHaveBeenCalledTimes(2);
      expect(subscriptionRepository.findByClubId).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'club-1',
        name: 'Volleyball Club A',
        description: 'First club',
        logo: 'logo1.jpg',
        location: 'Paris',
        ownerId: 'user-1',
        createdAt: expect.any(Date),
        memberCount: 5,
        teamCount: 0,
        subscriptionPlanName: 'Free',
        subscriptionStatus: 'INACTIVE',
      });
      expect(result[1]).toEqual({
        id: 'club-2',
        name: 'Volleyball Club B',
        description: 'Second club',
        logo: 'logo2.jpg',
        location: 'Lyon',
        ownerId: 'user-2',
        createdAt: expect.any(Date),
        memberCount: 5,
        teamCount: 0,
        subscriptionPlanName: 'Free',
        subscriptionStatus: 'INACTIVE',
      });
    });

    it('should return empty list when no clubs exist', async () => {
      const query = new ListClubsQuery();

      clubRepository.findAll.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(clubRepository.findAll).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
        searchTerm: undefined,
      });
      expect(result).toEqual([]);
    });

    it('should apply pagination parameters correctly', async () => {
      const query = new ListClubsQuery(10, 5);

      const mockClubs: Club[] = [
        Club.create({
          id: 'club-1',
          name: 'Volleyball Club A',
          ownerId: 'user-1',
        }),
        Club.create({
          id: 'club-2',
          name: 'Volleyball Club B',
          ownerId: 'user-2',
        }),
      ];

      clubRepository.findAll.mockResolvedValue(mockClubs);

      const result = await handler.execute(query);

      expect(clubRepository.findAll).toHaveBeenCalledWith({
        skip: 10,
        take: 5,
        searchTerm: undefined,
      });
      expect(result).toHaveLength(2);
    });

    it('should apply search term correctly', async () => {
      const query = new ListClubsQuery(undefined, undefined, 'Paris');

      const mockClubs: Club[] = [
        Club.create({
          id: 'club-1',
          name: 'Paris Volleyball Club',
          ownerId: 'user-1',
          location: 'Paris',
        }),
      ];

      clubRepository.findAll.mockResolvedValue(mockClubs);

      const result = await handler.execute(query);

      expect(clubRepository.findAll).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
        searchTerm: 'Paris',
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Paris Volleyball Club');
    });

    it('should apply all query parameters together', async () => {
      const query = new ListClubsQuery(0, 10, 'Volleyball');

      const mockClubs: Club[] = [
        Club.create({
          id: 'club-1',
          name: 'Volleyball Club A',
          ownerId: 'user-1',
        }),
        Club.create({
          id: 'club-2',
          name: 'Volleyball Club B',
          ownerId: 'user-2',
        }),
      ];

      clubRepository.findAll.mockResolvedValue(mockClubs);

      const result = await handler.execute(query);

      expect(clubRepository.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        searchTerm: 'Volleyball',
      });
      expect(result).toHaveLength(2);
    });

    it('should handle repository errors', async () => {
      const query = new ListClubsQuery();

      clubRepository.findAll.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed',
      );

      expect(clubRepository.findAll).toHaveBeenCalled();
    });
  });
});
