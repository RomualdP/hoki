import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ValidateInvitationHandler } from '../validate-invitation.handler';
import { ValidateInvitationQuery } from '../validate-invitation.query';
import {
  IInvitationRepository,
  INVITATION_REPOSITORY,
} from '../../../../domain/repositories/invitation.repository';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../../domain/repositories/club.repository';
import { Invitation } from '../../../../domain/entities/invitation.entity';
import { InvitationType } from '../../../../domain/value-objects/invitation-type.vo';
import { Club } from '../../../../domain/entities/club.entity';

describe('ValidateInvitationHandler', () => {
  let handler: ValidateInvitationHandler;
  let invitationRepository: jest.Mocked<IInvitationRepository>;
  let clubRepository: jest.Mocked<IClubRepository>;

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
        ValidateInvitationHandler,
        {
          provide: INVITATION_REPOSITORY,
          useValue: mockInvitationRepository,
        },
        {
          provide: CLUB_REPOSITORY,
          useValue: mockClubRepository,
        },
      ],
    }).compile();

    handler = module.get<ValidateInvitationHandler>(ValidateInvitationHandler);
    invitationRepository = module.get(INVITATION_REPOSITORY);
    clubRepository = module.get(CLUB_REPOSITORY);
  });

  describe('execute()', () => {
    it('should return valid invitation details for PLAYER type', async () => {
      const query = new ValidateInvitationQuery('token-123');

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 5);

      const mockInvitation = Invitation.create({
        id: 'inv-1',
        token: 'token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'coach-1',
        expiresInDays: 5,
      });

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Volleyball Club',
        ownerId: 'coach-1',
      });

      invitationRepository.findByToken.mockResolvedValue(mockInvitation);
      clubRepository.findById.mockResolvedValue(mockClub);

      const result = await handler.execute(query);

      expect(result).toEqual({
        id: 'inv-1',
        token: 'token-123',
        type: 'PLAYER',
        clubId: 'club-1',
        clubName: 'Test Volleyball Club',
        expiresAt: expect.any(Date),
        remainingDays: expect.any(Number),
        status: 'valid',
        createdBy: 'coach-1',
        createdAt: expect.any(Date),
        usedAt: undefined,
        usedBy: undefined,
        isValid: true,
        isExpired: false,
        isUsed: false,
        canBeUsed: true,
      });
      expect(result.status).toBe('valid');
      expect(result.remainingDays).toBeGreaterThan(0);
      expect(invitationRepository.findByToken).toHaveBeenCalledWith(
        'token-123',
      );
      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
    });

    it('should return valid invitation details for ASSISTANT_COACH type', async () => {
      const query = new ValidateInvitationQuery('assistant-token-456');

      const mockInvitation = Invitation.create({
        id: 'inv-2',
        token: 'assistant-token-456',
        clubId: 'club-2',
        type: InvitationType.ASSISTANT_COACH,
        createdBy: 'coach-2',
        expiresInDays: 7,
      });

      const mockClub = Club.create({
        id: 'club-2',
        name: 'Pro Volleyball Club',
        ownerId: 'coach-2',
      });

      invitationRepository.findByToken.mockResolvedValue(mockInvitation);
      clubRepository.findById.mockResolvedValue(mockClub);

      const result = await handler.execute(query);

      expect(result).toEqual(
        expect.objectContaining({
          id: 'inv-2',
          token: 'assistant-token-456',
          type: 'ASSISTANT_COACH',
          clubId: 'club-2',
          clubName: 'Pro Volleyball Club',
          status: 'valid',
          isValid: true,
          isExpired: false,
          isUsed: false,
          canBeUsed: true,
        }),
      );
    });

    it('should return expired status for expired invitation', async () => {
      const query = new ValidateInvitationQuery('expired-token');

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

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

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'coach-1',
      });

      invitationRepository.findByToken.mockResolvedValue(mockInvitation);
      clubRepository.findById.mockResolvedValue(mockClub);

      const result = await handler.execute(query);

      expect(result.status).toBe('expired');
      expect(result.remainingDays).toBe(0);
      expect(result.isExpired).toBe(true);
      expect(result.isValid).toBe(false);
      expect(result.canBeUsed).toBe(false);
    });

    it('should return used status for used invitation', async () => {
      const query = new ValidateInvitationQuery('used-token');

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const mockInvitation = Invitation.reconstitute({
        id: 'inv-4',
        token: 'used-token',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'coach-1',
        expiresAt: futureDate,
        usedAt: new Date(),
        usedBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'coach-1',
      });

      invitationRepository.findByToken.mockResolvedValue(mockInvitation);
      clubRepository.findById.mockResolvedValue(mockClub);

      const result = await handler.execute(query);

      expect(result.status).toBe('used');
      expect(result.usedAt).toBeInstanceOf(Date);
      expect(result.usedBy).toBe('user-1');
      expect(result.isUsed).toBe(true);
      expect(result.isValid).toBe(false);
      expect(result.canBeUsed).toBe(false);
    });

    it('should throw NotFoundException when token does not exist', async () => {
      const query = new ValidateInvitationQuery('invalid-token');

      invitationRepository.findByToken.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(query)).rejects.toThrow(
        'Invitation with token invalid-token not found',
      );

      expect(invitationRepository.findByToken).toHaveBeenCalledWith(
        'invalid-token',
      );
      expect(clubRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when club does not exist', async () => {
      const query = new ValidateInvitationQuery('token-orphan');

      const mockInvitation = Invitation.create({
        id: 'inv-5',
        token: 'token-orphan',
        clubId: 'nonexistent-club',
        type: InvitationType.PLAYER,
        createdBy: 'coach-1',
        expiresInDays: 7,
      });

      invitationRepository.findByToken.mockResolvedValue(mockInvitation);
      clubRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(query)).rejects.toThrow(
        'Club nonexistent-club associated with invitation not found',
      );

      expect(invitationRepository.findByToken).toHaveBeenCalledWith(
        'token-orphan',
      );
      expect(clubRepository.findById).toHaveBeenCalledWith('nonexistent-club');
    });

    it('should handle invitation repository errors', async () => {
      const query = new ValidateInvitationQuery('token-error');

      invitationRepository.findByToken.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed',
      );

      expect(invitationRepository.findByToken).toHaveBeenCalledWith(
        'token-error',
      );
    });

    it('should calculate correct remaining days', async () => {
      const query = new ValidateInvitationQuery('token-days');

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);

      const mockInvitation = Invitation.reconstitute({
        id: 'inv-6',
        token: 'token-days',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'coach-1',
        expiresAt: futureDate,
        usedAt: null,
        usedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'coach-1',
      });

      invitationRepository.findByToken.mockResolvedValue(mockInvitation);
      clubRepository.findById.mockResolvedValue(mockClub);

      const result = await handler.execute(query);

      expect(result.remainingDays).toBeGreaterThanOrEqual(9);
      expect(result.remainingDays).toBeLessThanOrEqual(11);
    });
  });
});
