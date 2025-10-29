import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetMyClubHandler } from '../get-my-club.handler';
import { GetMyClubQuery } from '../get-my-club.query';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../../domain/repositories/club.repository';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../../domain/repositories/member.repository';
import { Club } from '../../../../domain/entities/club.entity';
import { Member } from '../../../../domain/entities/member.entity';
import { ClubRole } from '../../../../domain/value-objects/club-role.vo';

describe('GetMyClubHandler', () => {
  let handler: GetMyClubHandler;
  let clubRepository: jest.Mocked<IClubRepository>;
  let memberRepository: jest.Mocked<IMemberRepository>;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMyClubHandler,
        {
          provide: CLUB_REPOSITORY,
          useValue: mockClubRepository,
        },
        {
          provide: MEMBER_REPOSITORY,
          useValue: mockMemberRepository,
        },
      ],
    }).compile();

    handler = module.get<GetMyClubHandler>(GetMyClubHandler);
    clubRepository = module.get(CLUB_REPOSITORY);
    memberRepository = module.get(MEMBER_REPOSITORY);
  });

  describe('execute()', () => {
    it('should return club detail when user has active membership', async () => {
      const query = new GetMyClubQuery('user-1');

      const mockMember = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Volleyball Club',
        description: 'A great club',
        logo: 'https://example.com/logo.png',
        location: 'Paris, France',
        ownerId: 'user-owner',
      });

      memberRepository.findActiveByUserId.mockResolvedValue(mockMember);
      clubRepository.findById.mockResolvedValue(mockClub);

      const result = await handler.execute(query);

      expect(result).toEqual({
        id: 'club-1',
        name: 'Test Volleyball Club',
        description: 'A great club',
        logo: 'https://example.com/logo.png',
        location: 'Paris, France',
        ownerId: 'user-owner',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(memberRepository.findActiveByUserId).toHaveBeenCalledWith(
        'user-1',
      );
      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
    });

    it('should return club with null optional fields', async () => {
      const query = new GetMyClubQuery('user-2');

      const mockMember = Member.create({
        id: 'member-2',
        userId: 'user-2',
        clubId: 'club-2',
        role: ClubRole.COACH,
      });

      const mockClub = Club.create({
        id: 'club-2',
        name: 'Simple Club',
        ownerId: 'user-2',
      });

      memberRepository.findActiveByUserId.mockResolvedValue(mockMember);
      clubRepository.findById.mockResolvedValue(mockClub);

      const result = await handler.execute(query);

      expect(result).toEqual({
        id: 'club-2',
        name: 'Simple Club',
        description: null,
        logo: null,
        location: null,
        ownerId: 'user-2',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException when user has no active membership', async () => {
      const query = new GetMyClubQuery('user-no-club');

      memberRepository.findActiveByUserId.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(query)).rejects.toThrow(
        'User has no active club membership',
      );

      expect(memberRepository.findActiveByUserId).toHaveBeenCalledWith(
        'user-no-club',
      );
      expect(clubRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when club does not exist', async () => {
      const query = new GetMyClubQuery('user-1');

      const mockMember = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'deleted-club',
        role: ClubRole.PLAYER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(mockMember);
      clubRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(query)).rejects.toThrow(
        'Club with ID deleted-club not found',
      );

      expect(memberRepository.findActiveByUserId).toHaveBeenCalledWith(
        'user-1',
      );
      expect(clubRepository.findById).toHaveBeenCalledWith('deleted-club');
    });

    it('should handle repository errors from member repository', async () => {
      const query = new GetMyClubQuery('user-1');

      memberRepository.findActiveByUserId.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed',
      );

      expect(memberRepository.findActiveByUserId).toHaveBeenCalledWith(
        'user-1',
      );
      expect(clubRepository.findById).not.toHaveBeenCalled();
    });

    it('should handle repository errors from club repository', async () => {
      const query = new GetMyClubQuery('user-1');

      const mockMember = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(mockMember);
      clubRepository.findById.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed',
      );

      expect(memberRepository.findActiveByUserId).toHaveBeenCalledWith(
        'user-1',
      );
      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
    });

    it('should work correctly for COACH role', async () => {
      const query = new GetMyClubQuery('coach-1');

      const mockMember = Member.create({
        id: 'member-coach',
        userId: 'coach-1',
        clubId: 'club-1',
        role: ClubRole.COACH,
      });

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Coaching Club',
        ownerId: 'coach-1',
      });

      memberRepository.findActiveByUserId.mockResolvedValue(mockMember);
      clubRepository.findById.mockResolvedValue(mockClub);

      const result = await handler.execute(query);

      expect(result.id).toBe('club-1');
      expect(result.ownerId).toBe('coach-1');
    });
  });
});
