import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AcceptInvitationHandler } from '../accept-invitation.handler';
import { AcceptInvitationCommand } from '../accept-invitation.command';
import {
  IInvitationRepository,
  INVITATION_REPOSITORY,
} from '../../../../domain/repositories/invitation.repository';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../../domain/repositories/member.repository';
import { Invitation } from '../../../../domain/entities/invitation.entity';
import { InvitationType } from '../../../../domain/value-objects/invitation-type.vo';
import { Member } from '../../../../domain/entities/member.entity';
import { ClubRole } from '../../../../domain/value-objects/club-role.vo';

describe('AcceptInvitationHandler', () => {
  let handler: AcceptInvitationHandler;
  let invitationRepository: jest.Mocked<IInvitationRepository>;
  let memberRepository: jest.Mocked<IMemberRepository>;

  beforeEach(async () => {
    const mockInvitationRepository: jest.Mocked<IInvitationRepository> = {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByToken: jest.fn(),
      findByClubId: jest.fn(),
      findByCreatorId: jest.fn(),
      findByType: jest.fn(),
      findValidByClubId: jest.fn(),
      findExpired: jest.fn(),
      findUsed: jest.fn(),
      findUsedByUserId: jest.fn(),
      existsByToken: jest.fn(),
      delete: jest.fn(),
      deleteExpired: jest.fn(),
      countByClubId: jest.fn(),
      countValidByClubId: jest.fn(),
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
        AcceptInvitationHandler,
        {
          provide: INVITATION_REPOSITORY,
          useValue: mockInvitationRepository,
        },
        {
          provide: MEMBER_REPOSITORY,
          useValue: mockMemberRepository,
        },
      ],
    }).compile();

    handler = module.get<AcceptInvitationHandler>(AcceptInvitationHandler);
    invitationRepository = module.get(INVITATION_REPOSITORY);
    memberRepository = module.get(MEMBER_REPOSITORY);
  });

  describe('execute()', () => {
    it('should accept invitation and create PLAYER member successfully', async () => {
      const command = new AcceptInvitationCommand('valid-token-123', 'user-1');

      const mockInvitation = Invitation.create({
        id: 'inv-1',
        token: 'valid-token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'coach-1',
        expiresInDays: 7,
      });

      invitationRepository.findByToken.mockResolvedValue(mockInvitation);
      invitationRepository.update.mockResolvedValue(mockInvitation);

      const mockMember = Member.create({
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: ClubRole.PLAYER,
        invitedBy: 'coach-1',
      });

      memberRepository.save.mockResolvedValue(mockMember);

      const result = await handler.execute(command);

      expect(result).toBe('member-1');
      expect(invitationRepository.findByToken).toHaveBeenCalledWith(
        'valid-token-123',
      );

      expect(invitationRepository.update).toHaveBeenCalled();

      expect(memberRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.PLAYER,
        }),
      );
    });

    it('should accept invitation and create COACH member successfully', async () => {
      const command = new AcceptInvitationCommand(
        'assistant-token-456',
        'user-2',
      );

      const mockInvitation = Invitation.create({
        id: 'inv-2',
        token: 'assistant-token-456',
        clubId: 'club-2',
        type: InvitationType.COACH,
        createdBy: 'coach-2',
        expiresInDays: 14,
      });

      invitationRepository.findByToken.mockResolvedValue(mockInvitation);
      invitationRepository.update.mockResolvedValue(mockInvitation);

      const mockMember = Member.create({
        id: 'member-2',
        userId: 'user-2',
        clubId: 'club-2',
        role: ClubRole.COACH,
        invitedBy: 'coach-2',
      });

      memberRepository.save.mockResolvedValue(mockMember);

      const result = await handler.execute(command);

      expect(result).toBe('member-2');

      expect(memberRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          role: ClubRole.COACH,
        }),
      );
    });

    it('should throw NotFoundException when token does not exist', async () => {
      const command = new AcceptInvitationCommand('invalid-token', 'user-1');

      invitationRepository.findByToken.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        'Invitation not found',
      );

      expect(invitationRepository.findByToken).toHaveBeenCalledWith(
        'invalid-token',
      );

      expect(invitationRepository.update).not.toHaveBeenCalled();

      expect(memberRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when invitation has expired', async () => {
      const command = new AcceptInvitationCommand('expired-token', 'user-1');

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);

      const mockInvitation = Invitation.reconstitute({
        id: 'inv-3',
        token: 'expired-token',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'coach-1',
        expiresAt: pastDate,
        usedAt: null,
        usedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      invitationRepository.findByToken.mockResolvedValue(mockInvitation);

      await expect(handler.execute(command)).rejects.toThrow(
        'Invitation has expired',
      );

      expect(invitationRepository.update).not.toHaveBeenCalled();

      expect(memberRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when invitation has already been used', async () => {
      const command = new AcceptInvitationCommand('used-token', 'user-2');

      const mockInvitation = Invitation.reconstitute({
        id: 'inv-4',
        token: 'used-token',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'coach-1',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        usedAt: new Date(),
        usedBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      invitationRepository.findByToken.mockResolvedValue(mockInvitation);

      await expect(handler.execute(command)).rejects.toThrow(
        'Invitation has already been used',
      );

      expect(invitationRepository.update).not.toHaveBeenCalled();

      expect(memberRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when user tries to accept their own invitation', async () => {
      const command = new AcceptInvitationCommand('self-token', 'coach-1');

      const mockInvitation = Invitation.create({
        id: 'inv-5',
        token: 'self-token',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'coach-1',
        expiresInDays: 7,
      });

      invitationRepository.findByToken.mockResolvedValue(mockInvitation);

      await expect(handler.execute(command)).rejects.toThrow(
        'Cannot accept your own invitation',
      );

      expect(invitationRepository.update).not.toHaveBeenCalled();

      expect(memberRepository.save).not.toHaveBeenCalled();
    });

    it('should handle member repository save errors', async () => {
      const command = new AcceptInvitationCommand('valid-token', 'user-1');

      const mockInvitation = Invitation.create({
        id: 'inv-6',
        token: 'valid-token',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'coach-1',
        expiresInDays: 7,
      });

      invitationRepository.findByToken.mockResolvedValue(mockInvitation);
      invitationRepository.update.mockResolvedValue(mockInvitation);
      memberRepository.save.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed',
      );

      expect(invitationRepository.findByToken).toHaveBeenCalled();

      expect(invitationRepository.update).toHaveBeenCalled();

      expect(memberRepository.save).toHaveBeenCalled();
    });
  });
});
