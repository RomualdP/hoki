import { Test, TestingModule } from '@nestjs/testing';
import { GenerateInvitationHandler } from '../generate-invitation.handler';
import { GenerateInvitationCommand } from '../generate-invitation.command';
import {
  IInvitationRepository,
  INVITATION_REPOSITORY,
} from '../../../../domain/repositories/invitation.repository';
import {
  Invitation,
  InvitationType,
} from '../../../../domain/entities/invitation.entity';

describe('GenerateInvitationHandler', () => {
  let handler: GenerateInvitationHandler;
  let invitationRepository: jest.Mocked<IInvitationRepository>;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateInvitationHandler,
        {
          provide: INVITATION_REPOSITORY,
          useValue: mockInvitationRepository,
        },
      ],
    }).compile();

    handler = module.get<GenerateInvitationHandler>(GenerateInvitationHandler);
    invitationRepository = module.get(INVITATION_REPOSITORY);
  });

  describe('execute()', () => {
    it('should generate invitation token for PLAYER type', async () => {
      const command = new GenerateInvitationCommand(
        'club-1',
        InvitationType.PLAYER,
        'coach-1',
        7,
      );

      const mockInvitation = Invitation.create({
        id: 'inv-1',
        token: 'generated-token-123',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'coach-1',
        expiresInDays: 7,
      });

      invitationRepository.save.mockResolvedValue(mockInvitation);

      const result = await handler.execute(command);

      expect(result).toBe('generated-token-123');
      expect(invitationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          clubId: 'club-1',
          type: InvitationType.PLAYER,
          createdBy: 'coach-1',
        }),
      );
    });

    it('should generate invitation token for ASSISTANT_COACH type', async () => {
      const command = new GenerateInvitationCommand(
        'club-2',
        InvitationType.ASSISTANT_COACH,
        'coach-2',
        14,
      );

      const mockInvitation = Invitation.create({
        id: 'inv-2',
        token: 'another-token-456',
        clubId: 'club-2',
        type: InvitationType.ASSISTANT_COACH,
        createdBy: 'coach-2',
        expiresInDays: 14,
      });

      invitationRepository.save.mockResolvedValue(mockInvitation);

      const result = await handler.execute(command);

      expect(result).toBe('another-token-456');
      expect(invitationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          type: InvitationType.ASSISTANT_COACH,
        }),
      );
    });

    it('should use default expiration days when not specified', async () => {
      const command = new GenerateInvitationCommand(
        'club-1',
        InvitationType.PLAYER,
        'coach-1',
      );

      const mockInvitation = Invitation.create({
        id: 'inv-3',
        token: 'token-789',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'coach-1',
      });

      invitationRepository.save.mockResolvedValue(mockInvitation);

      const result = await handler.execute(command);

      expect(result).toBeTruthy();
      expect(invitationRepository.save).toHaveBeenCalled();
    });

    it('should generate unique tokens for each invitation', async () => {
      const command1 = new GenerateInvitationCommand(
        'club-1',
        InvitationType.PLAYER,
        'coach-1',
      );

      const command2 = new GenerateInvitationCommand(
        'club-1',
        InvitationType.PLAYER,
        'coach-1',
      );

      const mockInvitation1 = Invitation.create({
        id: 'inv-1',
        token: 'unique-token-1',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'coach-1',
      });

      const mockInvitation2 = Invitation.create({
        id: 'inv-2',
        token: 'unique-token-2',
        clubId: 'club-1',
        type: InvitationType.PLAYER,
        createdBy: 'coach-1',
      });

      invitationRepository.save
        .mockResolvedValueOnce(mockInvitation1)
        .mockResolvedValueOnce(mockInvitation2);

      const result1 = await handler.execute(command1);
      const result2 = await handler.execute(command2);

      expect(result1).not.toBe(result2);
      expect(invitationRepository.save).toHaveBeenCalledTimes(2);
    });

    it('should handle repository save errors', async () => {
      const command = new GenerateInvitationCommand(
        'club-1',
        InvitationType.PLAYER,
        'coach-1',
      );

      invitationRepository.save.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed',
      );

      expect(invitationRepository.save).toHaveBeenCalled();
    });
  });
});
