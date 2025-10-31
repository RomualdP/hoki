import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ChangeClubHandler } from '../change-club.handler';
import { ChangeClubCommand } from '../change-club.command';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../../domain/repositories/member.repository';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../../domain/repositories/club.repository';
import { ClubTransferService } from '../../../../domain/services/club-transfer.service';
import { Member } from '../../../../domain/entities/member.entity';
import { ClubRole } from '../../../../domain/value-objects/club-role.vo';
import { Club } from '../../../../domain/entities/club.entity';

describe('ChangeClubHandler', () => {
  let handler: ChangeClubHandler;
  let memberRepository: jest.Mocked<IMemberRepository>;
  let clubRepository: jest.Mocked<IClubRepository>;

  beforeEach(async () => {
    const mockMemberRepository: jest.Mocked<IMemberRepository> = {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByClubId: jest.fn(),
      findByUserIdAndClubId: jest.fn(),
      findActiveByUserId: jest.fn(),
      findActiveByClubId: jest.fn(),
      findByClubIdAndRole: jest.fn(),
      findActiveByClubIdAndRole: jest.fn(),
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
        ChangeClubHandler,
        {
          provide: MEMBER_REPOSITORY,
          useValue: mockMemberRepository,
        },
        {
          provide: CLUB_REPOSITORY,
          useValue: mockClubRepository,
        },
        ClubTransferService,
      ],
    }).compile();

    handler = module.get<ChangeClubHandler>(ChangeClubHandler);
    memberRepository = module.get(MEMBER_REPOSITORY);
    clubRepository = module.get(CLUB_REPOSITORY);
  });

  describe('execute()', () => {
    it('should change club successfully for PLAYER', async () => {
      const command = new ChangeClubCommand('user-1', 'new-club-1');

      const mockCurrentMember = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'old-club-1',
        role: ClubRole.PLAYER,
      });

      const mockNewClub = Club.create({
        id: 'new-club-1',
        name: 'New Club',
        ownerId: 'owner-1',
      });

      const mockNewMember = Member.create({
        id: expect.any(String),
        userId: 'user-1',
        clubId: 'new-club-1',
        role: ClubRole.PLAYER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(mockCurrentMember);
      clubRepository.findById.mockResolvedValue(mockNewClub);
      memberRepository.update.mockResolvedValue(mockCurrentMember);
      memberRepository.save.mockResolvedValue(mockNewMember);

      const result = await handler.execute(command);

      expect(memberRepository.findActiveByUserId).toHaveBeenCalledWith(
        'user-1',
      );
      expect(clubRepository.findById).toHaveBeenCalledWith('new-club-1');
      expect(memberRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'member-1',
          leftAt: expect.any(Date),
        }),
      );
      expect(memberRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          clubId: 'new-club-1',
          role: ClubRole.PLAYER,
        }),
      );
      expect(result).toBe(mockNewMember.id);
    });

    it('should throw NotFoundException when user has no active membership', async () => {
      const command = new ChangeClubCommand('user-without-club', 'new-club-1');

      memberRepository.findActiveByUserId.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        'User has no active club membership',
      );

      expect(memberRepository.findActiveByUserId).toHaveBeenCalledWith(
        'user-without-club',
      );
      expect(clubRepository.findById).not.toHaveBeenCalled();
      expect(memberRepository.update).not.toHaveBeenCalled();
      expect(memberRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when new club does not exist', async () => {
      const command = new ChangeClubCommand('user-1', 'non-existent-club');

      const mockCurrentMember = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'old-club-1',
        role: ClubRole.PLAYER,
      });

      memberRepository.findActiveByUserId.mockResolvedValue(mockCurrentMember);
      clubRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        'Club with ID non-existent-club not found',
      );

      expect(clubRepository.findById).toHaveBeenCalledWith('non-existent-club');
      expect(memberRepository.update).not.toHaveBeenCalled();
      expect(memberRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when trying to transfer to same club', async () => {
      const command = new ChangeClubCommand('user-1', 'same-club-1');

      const mockCurrentMember = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'same-club-1',
        role: ClubRole.PLAYER,
      });

      const mockClub = Club.create({
        id: 'same-club-1',
        name: 'Same Club',
        ownerId: 'owner-1',
      });

      memberRepository.findActiveByUserId.mockResolvedValue(mockCurrentMember);
      clubRepository.findById.mockResolvedValue(mockClub);

      await expect(handler.execute(command)).rejects.toThrow(
        'Player is already a member of this club',
      );

      expect(memberRepository.update).not.toHaveBeenCalled();
      expect(memberRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when COACH tries to change club', async () => {
      const command = new ChangeClubCommand('coach-user-1', 'new-club-1');

      const mockCurrentMember = Member.create({
        id: 'member-1',
        userId: 'coach-user-1',
        clubId: 'old-club-1',
        role: ClubRole.COACH,
      });

      const mockNewClub = Club.create({
        id: 'new-club-1',
        name: 'New Club',
        ownerId: 'owner-1',
      });

      memberRepository.findActiveByUserId.mockResolvedValue(mockCurrentMember);
      clubRepository.findById.mockResolvedValue(mockNewClub);

      await expect(handler.execute(command)).rejects.toThrow(
        'Only players can transfer between clubs. Owners and coaches must leave their current club first.',
      );

      expect(memberRepository.update).not.toHaveBeenCalled();
      expect(memberRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when COACH tries to change club (duplicate test)', async () => {
      const command = new ChangeClubCommand('coach-user-1', 'new-club-1');

      const mockCurrentMember = Member.create({
        id: 'member-1',
        userId: 'coach-user-1',
        clubId: 'old-club-1',
        role: ClubRole.COACH,
      });

      const mockNewClub = Club.create({
        id: 'new-club-1',
        name: 'New Club',
        ownerId: 'owner-1',
      });

      memberRepository.findActiveByUserId.mockResolvedValue(mockCurrentMember);
      clubRepository.findById.mockResolvedValue(mockNewClub);

      await expect(handler.execute(command)).rejects.toThrow(
        'Only players can transfer between clubs. Owners and coaches must leave their current club first.',
      );

      expect(memberRepository.update).not.toHaveBeenCalled();
      expect(memberRepository.save).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const command = new ChangeClubCommand('user-1', 'new-club-1');

      const mockCurrentMember = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'old-club-1',
        role: ClubRole.PLAYER,
      });

      const mockNewClub = Club.create({
        id: 'new-club-1',
        name: 'New Club',
        ownerId: 'owner-1',
      });

      memberRepository.findActiveByUserId.mockResolvedValue(mockCurrentMember);
      clubRepository.findById.mockResolvedValue(mockNewClub);
      memberRepository.update.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed',
      );

      expect(memberRepository.update).toHaveBeenCalled();
    });
  });
});
