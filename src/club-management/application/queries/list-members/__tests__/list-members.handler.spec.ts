import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
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
import { Club } from '../../../../domain/entities/club.entity';
import { Member, ClubRole } from '../../../../domain/entities/member.entity';
import { ClubRoleVO } from '../../../../domain/value-objects/club-role.vo';

describe('ListMembersHandler', () => {
  let handler: ListMembersHandler;
  let memberRepository: jest.Mocked<IMemberRepository>;
  let clubRepository: jest.Mocked<IClubRepository>;

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
      ],
    }).compile();

    handler = module.get<ListMembersHandler>(ListMembersHandler);
    memberRepository = module.get(MEMBER_REPOSITORY);
    clubRepository = module.get(CLUB_REPOSITORY);
  });

  describe('execute()', () => {
    it('should return all club members without role filter', async () => {
      const query = new ListMembersQuery('club-1');

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const mockCoach = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.COACH,
      });

      const mockPlayer = Member.create({
        id: 'member-2',
        userId: 'user-2',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        invitedBy: 'user-1',
      });

      const mockAssistant = Member.create({
        id: 'member-3',
        userId: 'user-3',
        clubId: 'club-1',
        role: ClubRole.ASSISTANT_COACH,
        invitedBy: 'user-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([
        mockCoach,
        mockPlayer,
        mockAssistant,
      ]);

      const result = await handler.execute(query);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'member-1',
          userId: 'user-1',
          clubId: 'club-1',
          role: 'COACH',
          roleName: expect.any(String),
          joinedAt: expect.any(Date),
          isActive: true,
          canManageClubSettings: true,
          canManageTeams: true,
          canInviteMembers: true,
          canManageSubscription: true,
          isCoach: true,
          isAssistantCoach: false,
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
          role: 'ASSISTANT_COACH',
          isAssistantCoach: true,
          canManageTeams: true,
        }),
      );
      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(memberRepository.findByClubId).toHaveBeenCalledWith('club-1');
    });

    it('should filter members by COACH role', async () => {
      const query = new ListMembersQuery('club-1', ClubRoleVO.coach());

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const mockCoach = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.COACH,
      });

      const mockPlayer = Member.create({
        id: 'member-2',
        userId: 'user-2',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        invitedBy: 'user-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([mockCoach, mockPlayer]);

      const result = await handler.execute(query);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'member-1',
          role: 'COACH',
          isCoach: true,
        }),
      );
    });

    it('should filter members by PLAYER role', async () => {
      const query = new ListMembersQuery('club-1', ClubRoleVO.player());

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const mockCoach = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.COACH,
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

      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([
        mockCoach,
        mockPlayer1,
        mockPlayer2,
      ]);

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

    it('should filter members by ASSISTANT_COACH role', async () => {
      const query = new ListMembersQuery('club-1', ClubRoleVO.assistantCoach());

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const mockCoach = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.COACH,
      });

      const mockAssistant = Member.create({
        id: 'member-2',
        userId: 'user-2',
        clubId: 'club-1',
        role: ClubRole.ASSISTANT_COACH,
        invitedBy: 'user-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([
        mockCoach,
        mockAssistant,
      ]);

      const result = await handler.execute(query);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'member-2',
          role: 'ASSISTANT_COACH',
          isAssistantCoach: true,
        }),
      );
    });

    it('should return empty array when club has no members', async () => {
      const query = new ListMembersQuery('club-1');

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(memberRepository.findByClubId).toHaveBeenCalledWith('club-1');
    });

    it('should return empty array when role filter matches no members', async () => {
      const query = new ListMembersQuery('club-1', ClubRoleVO.assistantCoach());

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

      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([mockPlayer]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
    });

    it('should throw NotFoundException when club does not exist', async () => {
      const query = new ListMembersQuery('non-existent-club');

      clubRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(query)).rejects.toThrow(
        'Club non-existent-club not found',
      );

      expect(clubRepository.findById).toHaveBeenCalledWith('non-existent-club');
      expect(memberRepository.findByClubId).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const query = new ListMembersQuery('club-1');

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

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
      const query = new ListMembersQuery('club-1');

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

      clubRepository.findById.mockResolvedValue(mockClub);
      memberRepository.findByClubId.mockResolvedValue([mockPlayer]);

      const result = await handler.execute(query);

      expect(result[0]).toEqual({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: 'PLAYER',
        roleName: expect.any(String),
        joinedAt: expect.any(Date),
        isActive: true,
        canManageClubSettings: false,
        canManageTeams: false,
        canInviteMembers: false,
        canManageSubscription: false,
        isCoach: false,
        isAssistantCoach: false,
        isPlayer: true,
      });
    });
  });
});
