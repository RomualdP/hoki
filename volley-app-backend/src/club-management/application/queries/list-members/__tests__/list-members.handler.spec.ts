import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ListMembersHandler } from '../list-members.handler';
import { ListMembersQuery } from '../list-members.query';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../../domain/repositories/member.repository';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../../domain/repositories/club.repository';
import { MemberReadModelService } from '../../../services/member-read-model.service';
import { Club } from '../../../../domain/entities/club.entity';
import { Member } from '../../../../domain/entities/member.entity';
import {
  ClubRole,
  ClubRoleVO,
} from '../../../../domain/value-objects/club-role.vo';
import { MemberListReadModel } from '../../../read-models/member-list.read-model';

describe('ListMembersHandler', () => {
  let handler: ListMembersHandler;
  let memberRepository: jest.Mocked<IMemberRepository>;
  let clubRepository: jest.Mocked<IClubRepository>;
  let memberReadModelService: jest.Mocked<MemberReadModelService>;

  beforeEach(async () => {
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

    const mockMemberReadModelService: jest.Mocked<MemberReadModelService> = {
      enrichMembersWithUserData: jest.fn(),
    } as unknown as jest.Mocked<MemberReadModelService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListMembersHandler,
        {
          provide: MEMBER_REPOSITORY,
          useValue: mockMemberRepository,
        },
        {
          provide: CLUB_REPOSITORY,
          useValue: mockClubRepository,
        },
        {
          provide: MemberReadModelService,
          useValue: mockMemberReadModelService,
        },
      ],
    }).compile();

    handler = module.get<ListMembersHandler>(ListMembersHandler);
    memberRepository = module.get(MEMBER_REPOSITORY);
    clubRepository = module.get(CLUB_REPOSITORY);
    memberReadModelService = module.get(MemberReadModelService);
  });

  describe('execute()', () => {
    it('should throw ForbiddenException when userId is not provided', async () => {
      const query = new ListMembersQuery('club-1');

      await expect(handler.execute(query)).rejects.toThrow(ForbiddenException);
      await expect(handler.execute(query)).rejects.toThrow(
        'Authentication required',
      );
    });

    it('should throw ForbiddenException when user has no active club membership', async () => {
      const query = new ListMembersQuery('club-1', undefined, 'user-1');

      memberRepository.findActiveByUserId.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(ForbiddenException);
      await expect(handler.execute(query)).rejects.toThrow(
        'You must be part of a club to list members',
      );
    });

    it('should throw ForbiddenException when user tries to access another club', async () => {
      const query = new ListMembersQuery('club-2', undefined, 'user-1');

      const mockActiveMembership = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(
        mockActiveMembership,
      );

      await expect(handler.execute(query)).rejects.toThrow(ForbiddenException);
      await expect(handler.execute(query)).rejects.toThrow(
        'You cannot access members from another club',
      );
    });

    it('should return all club members without role filter', async () => {
      const query = new ListMembersQuery('club-1', undefined, 'user-1');

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const mockOwner = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      const mockPlayer = Member.create({
        id: 'member-2',
        userId: 'user-2',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        invitedBy: 'user-1',
      });

      const mockCoach = Member.create({
        id: 'member-3',
        userId: 'user-3',
        clubId: 'club-1',
        role: ClubRole.COACH,
        invitedBy: 'user-1',
      });

      const mockActiveMembership = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(
        mockActiveMembership,
      );
      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([
        mockOwner,
        mockPlayer,
        mockCoach,
      ]);

      const expectedReadModels = [
        {
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: 'OWNER',
          roleName: expect.any(String),
          joinedAt: expect.any(Date),
          isActive: true,
          userFirstName: 'John',
          userLastName: 'Owner',
          userEmail: 'owner@test.com',
          userAvatar: undefined,
          canManageClubSettings: true,
          canManageTeams: true,
          canInviteMembers: true,
          canManageSubscription: true,
          isOwner: true,
          isCoach: false,
          isPlayer: false,
        },
        {
          id: 'member-2',
          userId: 'user-2',
          clubId: 'club-1',
          role: 'PLAYER',
          roleName: expect.any(String),
          joinedAt: expect.any(Date),
          isActive: true,
          userFirstName: 'Jane',
          userLastName: 'Player',
          userEmail: 'player@test.com',
          userAvatar: undefined,
          canManageClubSettings: false,
          canManageTeams: false,
          canInviteMembers: false,
          canManageSubscription: false,
          isOwner: false,
          isCoach: false,
          isPlayer: true,
        },
        {
          id: 'member-3',
          userId: 'user-3',
          clubId: 'club-1',
          role: 'COACH',
          roleName: expect.any(String),
          joinedAt: expect.any(Date),
          isActive: true,
          userFirstName: 'Bob',
          userLastName: 'Coach',
          userEmail: 'coach@test.com',
          userAvatar: undefined,
          canManageClubSettings: true,
          canManageTeams: true,
          canInviteMembers: true,
          canManageSubscription: false,
          isOwner: false,
          isCoach: true,
          isPlayer: false,
        },
      ];

      memberReadModelService.enrichMembersWithUserData.mockResolvedValue(
        expectedReadModels,
      );

      const result = await handler.execute(query);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: 'OWNER',
          roleName: expect.any(String),
          joinedAt: expect.any(Date),
          isActive: true,
          userFirstName: 'John',
          userLastName: 'Owner',
          userEmail: 'owner@test.com',
          canManageClubSettings: true,
          canManageTeams: true,
          canInviteMembers: true,
          canManageSubscription: true,
          isOwner: true,
          isCoach: false,
          isPlayer: false,
        }),
      );
      expect(result[1]).toEqual(
        expect.objectContaining({
          role: 'PLAYER',
          isCoach: false,
          isPlayer: true,
          canManageClubSettings: false,
        }),
      );
      expect(result[2]).toEqual(
        expect.objectContaining({
          role: 'COACH',
          isCoach: true,
          canManageTeams: true,
        }),
      );
      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(memberRepository.findByClubId).toHaveBeenCalledWith('club-1');
      expect(
        memberReadModelService.enrichMembersWithUserData,
      ).toHaveBeenCalledWith([mockOwner, mockPlayer, mockCoach]);
    });

    it('should filter members by OWNER role', async () => {
      const query = new ListMembersQuery(
        'club-1',
        ClubRoleVO.owner(),
        'user-1',
      );

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const mockOwner = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      const mockPlayer = Member.create({
        id: 'member-2',
        userId: 'user-2',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        invitedBy: 'user-1',
      });

      const mockActiveMembership = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(
        mockActiveMembership,
      );
      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([mockOwner, mockPlayer]);

      memberReadModelService.enrichMembersWithUserData.mockResolvedValue([
        {
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: 'OWNER',
          roleName: expect.any(String),
          joinedAt: expect.any(Date),
          isActive: true,
          userFirstName: 'John',
          userLastName: 'Owner',
          userEmail: 'owner@test.com',
          userAvatar: undefined,
          canManageClubSettings: true,
          canManageTeams: true,
          canInviteMembers: true,
          canManageSubscription: true,
          isOwner: true,
          isCoach: false,
          isPlayer: false,
        },
      ] as MemberListReadModel[]);

      const result = await handler.execute(query);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'member-1',
          role: 'OWNER',
          isOwner: true,
        }),
      );
    });

    it('should filter members by PLAYER role', async () => {
      const query = new ListMembersQuery(
        'club-1',
        ClubRoleVO.player(),
        'user-1',
      );

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const mockOwner = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      const mockPlayer1 = Member.create({
        id: 'member-2',
        userId: 'user-2',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        invitedBy: 'user-1',
      });

      const mockPlayer2 = Member.create({
        id: 'member-3',
        userId: 'user-3',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        invitedBy: 'user-1',
      });

      const mockActiveMembership = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(
        mockActiveMembership,
      );
      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([
        mockOwner,
        mockPlayer1,
        mockPlayer2,
      ]);

      memberReadModelService.enrichMembersWithUserData.mockResolvedValue([
        {
          id: 'member-2',
          userId: 'user-2',
          clubId: 'club-1',
          role: 'PLAYER',
          roleName: expect.any(String),
          joinedAt: expect.any(Date),
          isActive: true,
          userFirstName: 'Jane',
          userLastName: 'Player',
          userEmail: 'player1@test.com',
          userAvatar: undefined,
          canManageClubSettings: false,
          canManageTeams: false,
          canInviteMembers: false,
          canManageSubscription: false,
          isOwner: false,
          isCoach: false,
          isPlayer: true,
        },
        {
          id: 'member-3',
          userId: 'user-3',
          clubId: 'club-1',
          role: 'PLAYER',
          roleName: expect.any(String),
          joinedAt: expect.any(Date),
          isActive: true,
          userFirstName: 'Bob',
          userLastName: 'Player',
          userEmail: 'player2@test.com',
          userAvatar: undefined,
          canManageClubSettings: false,
          canManageTeams: false,
          canInviteMembers: false,
          canManageSubscription: false,
          isOwner: false,
          isCoach: false,
          isPlayer: true,
        },
      ] as MemberListReadModel[]);

      const result = await handler.execute(query);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'member-2',
          role: 'PLAYER',
          isPlayer: true,
        }),
      );
      expect(result[1]).toEqual(
        expect.objectContaining({
          id: 'member-3',
          role: 'PLAYER',
          isPlayer: true,
        }),
      );
    });

    it('should filter members by COACH role', async () => {
      const query = new ListMembersQuery(
        'club-1',
        ClubRoleVO.coach(),
        'user-1',
      );

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const mockOwner = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      const mockCoach = Member.create({
        id: 'member-2',
        userId: 'user-2',
        clubId: 'club-1',
        role: ClubRole.COACH,
        invitedBy: 'user-1',
      });

      const mockActiveMembership = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(
        mockActiveMembership,
      );
      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([mockOwner, mockCoach]);

      memberReadModelService.enrichMembersWithUserData.mockResolvedValue([
        {
          id: 'member-2',
          userId: 'user-2',
          clubId: 'club-1',
          role: 'COACH',
          roleName: expect.any(String),
          joinedAt: expect.any(Date),
          isActive: true,
          userFirstName: 'Bob',
          userLastName: 'Coach',
          userEmail: 'coach@test.com',
          userAvatar: undefined,
          canManageClubSettings: true,
          canManageTeams: true,
          canInviteMembers: true,
          canManageSubscription: false,
          isOwner: false,
          isCoach: true,
          isPlayer: false,
        },
      ] as MemberListReadModel[]);

      const result = await handler.execute(query);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'member-2',
          role: 'COACH',
          isCoach: true,
        }),
      );
    });

    it('should return empty array when club has no members', async () => {
      const query = new ListMembersQuery('club-1', undefined, 'user-1');

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const mockActiveMembership = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(
        mockActiveMembership,
      );
      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([]);

      memberReadModelService.enrichMembersWithUserData.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(memberRepository.findByClubId).toHaveBeenCalledWith('club-1');
    });

    it('should return empty array when role filter matches no members', async () => {
      const query = new ListMembersQuery(
        'club-1',
        ClubRoleVO.coach(),
        'user-1',
      );

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const mockPlayer = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        invitedBy: 'user-1',
      });

      const mockActiveMembership = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(
        mockActiveMembership,
      );
      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([mockPlayer]);

      memberReadModelService.enrichMembersWithUserData.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
    });

    it('should throw NotFoundException when club does not exist', async () => {
      const query = new ListMembersQuery('club-1', undefined, 'user-1');

      const mockActiveMembership = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(
        mockActiveMembership,
      );
      clubRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(query)).rejects.toThrow(
        'Club club-1 not found',
      );

      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(memberRepository.findByClubId).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const query = new ListMembersQuery('club-1', undefined, 'user-1');

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const mockActiveMembership = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(
        mockActiveMembership,
      );
      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed',
      );

      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(memberRepository.findByClubId).toHaveBeenCalledWith('club-1');
    });

    it('should correctly map member permissions in read model', async () => {
      const query = new ListMembersQuery('club-1', undefined, 'user-1');

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const mockPlayer = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        invitedBy: 'coach-1',
      });

      const mockActiveMembership = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.OWNER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(
        mockActiveMembership,
      );
      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([mockPlayer]);

      memberReadModelService.enrichMembersWithUserData.mockResolvedValue([
        {
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: 'PLAYER',
          roleName: expect.any(String),
          joinedAt: expect.any(Date),
          isActive: true,
          userFirstName: 'Jane',
          userLastName: 'Player',
          userEmail: 'player@test.com',
          userAvatar: undefined,
          canManageClubSettings: false,
          canManageTeams: false,
          canInviteMembers: false,
          canManageSubscription: false,
          isOwner: false,
          isCoach: false,
          isPlayer: true,
        },
      ] as MemberListReadModel[]);

      const result = await handler.execute(query);

      expect(result[0]).toEqual({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: 'PLAYER',
        roleName: expect.any(String),
        joinedAt: expect.any(Date),
        isActive: true,
        userFirstName: 'Jane',
        userLastName: 'Player',
        userEmail: 'player@test.com',
        userAvatar: undefined,
        canManageClubSettings: false,
        canManageTeams: false,
        canInviteMembers: false,
        canManageSubscription: false,
        isOwner: false,
        isCoach: false,
        isPlayer: true,
      });
    });
  });
});
