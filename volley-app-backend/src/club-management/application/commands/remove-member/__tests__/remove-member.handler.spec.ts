import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RemoveMemberHandler } from '../remove-member.handler';
import { RemoveMemberCommand } from '../remove-member.command';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../../domain/repositories/member.repository';
import { Member } from '../../../../domain/entities/member.entity';
import { ClubRole } from '../../../../domain/value-objects/club-role.vo';
import { CannotRemoveSelfException } from '../../../../domain/exceptions';

describe('RemoveMemberHandler', () => {
  let handler: RemoveMemberHandler;
  let memberRepository: jest.Mocked<IMemberRepository>;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveMemberHandler,
        {
          provide: MEMBER_REPOSITORY,
          useValue: mockMemberRepository,
        },
      ],
    }).compile();

    handler = module.get<RemoveMemberHandler>(RemoveMemberHandler);
    memberRepository = module.get(MEMBER_REPOSITORY);
  });

  describe('execute()', () => {
    it('should remove member successfully when remover is COACH', async () => {
      const command = new RemoveMemberCommand('member-1', 'coach-user-id');

      const mockMember = Member.create({
        id: 'member-1',
        userId: 'player-user-id',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      const mockRemover = Member.create({
        id: 'remover-1',
        userId: 'coach-user-id',
        clubId: 'club-1',
        role: ClubRole.COACH,
      });

      memberRepository.findById.mockResolvedValue(mockMember);
      memberRepository.findByUserIdAndClubId.mockResolvedValue(mockRemover);
      memberRepository.update.mockResolvedValue(mockMember);

      await handler.execute(command);

      expect(memberRepository.findById).toHaveBeenCalledWith('member-1');
      expect(memberRepository.findByUserIdAndClubId).toHaveBeenCalledWith(
        'coach-user-id',
        'club-1',
      );
      expect(memberRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'member-1',
          leftAt: expect.any(Date),
        }),
      );
    });

    it('should throw NotFoundException when member does not exist', async () => {
      const command = new RemoveMemberCommand('non-existent', 'coach-user-id');

      memberRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        'Member not found',
      );

      expect(memberRepository.findById).toHaveBeenCalledWith('non-existent');
      expect(memberRepository.findByUserIdAndClubId).not.toHaveBeenCalled();
      expect(memberRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when remover is not found in club', async () => {
      const command = new RemoveMemberCommand('member-1', 'non-existent-user');

      const mockMember = Member.create({
        id: 'member-1',
        userId: 'player-user-id',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      memberRepository.findById.mockResolvedValue(mockMember);
      memberRepository.findByUserIdAndClubId.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        'Remover not found in club',
      );

      expect(memberRepository.findByUserIdAndClubId).toHaveBeenCalledWith(
        'non-existent-user',
        'club-1',
      );
      expect(memberRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error when remover is not OWNER or COACH', async () => {
      const command = new RemoveMemberCommand('member-1', 'player-user-id');

      const mockMember = Member.create({
        id: 'member-1',
        userId: 'target-player-id',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      const mockRemover = Member.create({
        id: 'remover-1',
        userId: 'player-user-id',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      memberRepository.findById.mockResolvedValue(mockMember);
      memberRepository.findByUserIdAndClubId.mockResolvedValue(mockRemover);

      await expect(handler.execute(command)).rejects.toThrow(
        'Only club owner or coaches can perform this action',
      );

      expect(memberRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when trying to remove self', async () => {
      const command = new RemoveMemberCommand(
        'coach-member-1',
        'coach-user-id',
      );

      const mockCoachMember = Member.create({
        id: 'coach-member-1',
        userId: 'coach-user-id',
        clubId: 'club-1',
        role: ClubRole.COACH,
      });

      const mockRemover = Member.create({
        id: 'remover-1',
        userId: 'coach-user-id',
        clubId: 'club-1',
        role: ClubRole.COACH,
      });

      memberRepository.findById.mockResolvedValue(mockCoachMember);
      memberRepository.findByUserIdAndClubId.mockResolvedValue(mockRemover);

      await expect(handler.execute(command)).rejects.toThrow(
        CannotRemoveSelfException,
      );
      await expect(handler.execute(command)).rejects.toThrow(
        'Cannot remove yourself from the club',
      );

      expect(memberRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const command = new RemoveMemberCommand('member-1', 'coach-user-id');

      const mockMember = Member.create({
        id: 'member-1',
        userId: 'player-user-id',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
      });

      const mockRemover = Member.create({
        id: 'remover-1',
        userId: 'coach-user-id',
        clubId: 'club-1',
        role: ClubRole.COACH,
      });

      memberRepository.findById.mockResolvedValue(mockMember);
      memberRepository.findByUserIdAndClubId.mockResolvedValue(mockRemover);
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
