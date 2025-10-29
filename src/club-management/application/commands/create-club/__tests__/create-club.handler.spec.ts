import { CreateClubHandler } from '../create-club.handler';
import { CreateClubCommand } from '../create-club.command';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../../domain/repositories/club.repository';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../../domain/repositories/member.repository';
import { TestRepositoryFactory } from '../../../../__tests__/factories/repository.factory';
import { TestModuleFactory } from '../../../../__tests__/factories/test-module.factory';
import { ClubBuilder } from '../../../../__tests__/builders/club.builder';
import { ClubRole } from '../../../../domain/value-objects/club-role.vo';

describe('CreateClubHandler', () => {
  let handler: CreateClubHandler;
  let clubRepository: jest.Mocked<IClubRepository>;
  let memberRepository: jest.Mocked<IMemberRepository>;

  beforeEach(async () => {
    // Create mock repositories using factory
    clubRepository = TestRepositoryFactory.createMockClubRepository();
    memberRepository = TestRepositoryFactory.createMockMemberRepository();

    // Create test module using factory
    const setup = await TestModuleFactory.createForHandler(CreateClubHandler, [
      { provide: CLUB_REPOSITORY, useValue: clubRepository },
      { provide: MEMBER_REPOSITORY, useValue: memberRepository },
    ]);

    handler = setup.handler;
  });

  describe('execute()', () => {
    it('should create a club successfully with all fields', async () => {
      const command = new CreateClubCommand(
        'Volleyball Club Paris',
        'Best club in Paris',
        'https://example.com/logo.png',
        'Paris, France',
        'user-1',
      );

      clubRepository.getAllClubNames.mockResolvedValue([]);

      // Use ClubBuilder for cleaner test setup
      const mockClub = new ClubBuilder()
        .withName(command.name)
        .withDescription(command.description)
        .withLogo(command.logo)
        .withLocation(command.location)
        .withOwnerId(command.ownerId)
        .build();

      clubRepository.save.mockResolvedValue(mockClub);

      const result = await handler.execute(command);

      expect(result).toBe('club-1');
      expect(clubRepository.getAllClubNames).toHaveBeenCalledTimes(1);
      expect(clubRepository.save).toHaveBeenCalledTimes(1);
      expect(clubRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Volleyball Club Paris',
          description: 'Best club in Paris',
          logo: 'https://example.com/logo.png',
          location: 'Paris, France',
          ownerId: 'user-1',
        }),
      );

      // Verify that a Member COACH is created for the owner
      expect(memberRepository.save).toHaveBeenCalledTimes(1);
      expect(memberRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          clubId: 'club-1',
          role: ClubRole.COACH,
          invitedBy: null,
        }),
      );
    });

    it('should create a club with only required fields', async () => {
      const command = new CreateClubCommand(
        'Simple Club',
        null,
        null,
        null,
        'user-1',
      );

      clubRepository.getAllClubNames.mockResolvedValue([]);

      // Use ClubBuilder with minimal configuration
      const mockClub = new ClubBuilder()
        .withId('club-2')
        .withName(command.name)
        .withOwnerId(command.ownerId)
        .build();

      clubRepository.save.mockResolvedValue(mockClub);

      const result = await handler.execute(command);

      expect(result).toBe('club-2');
      expect(clubRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Simple Club',
          ownerId: 'user-1',
          description: null,
          logo: null,
          location: null,
        }),
      );
    });

    it('should throw error when club name already exists (case insensitive)', async () => {
      const command = new CreateClubCommand(
        'Existing Club',
        null,
        null,
        null,
        'user-1',
      );

      clubRepository.getAllClubNames.mockResolvedValue([
        'Existing Club',
        'Other Club',
      ]);

      await expect(handler.execute(command)).rejects.toThrow(
        'A club with this name already exists',
      );

      expect(clubRepository.getAllClubNames).toHaveBeenCalledTimes(1);
      expect(clubRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when club name already exists with different casing', async () => {
      const command = new CreateClubCommand(
        'existing club',
        null,
        null,
        null,
        'user-1',
      );

      clubRepository.getAllClubNames.mockResolvedValue(['Existing Club']);

      await expect(handler.execute(command)).rejects.toThrow(
        'A club with this name already exists',
      );

      expect(clubRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when club name is empty', async () => {
      const command = new CreateClubCommand('', null, null, null, 'user-1');

      clubRepository.getAllClubNames.mockResolvedValue([]);

      await expect(handler.execute(command)).rejects.toThrow(
        'Club name cannot be empty',
      );

      expect(clubRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when club name is too long', async () => {
      const command = new CreateClubCommand(
        'A'.repeat(101),
        null,
        null,
        null,
        'user-1',
      );

      clubRepository.getAllClubNames.mockResolvedValue([]);

      await expect(handler.execute(command)).rejects.toThrow(
        'Club name cannot exceed 100 characters',
      );

      expect(clubRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when ownerId is empty', async () => {
      const command = new CreateClubCommand(
        'Valid Club Name',
        null,
        null,
        null,
        '',
      );

      clubRepository.getAllClubNames.mockResolvedValue([]);

      await expect(handler.execute(command)).rejects.toThrow(
        'Club must have an owner',
      );

      expect(clubRepository.save).not.toHaveBeenCalled();
    });

    it('should handle repository save errors', async () => {
      const command = new CreateClubCommand(
        'Valid Club',
        null,
        null,
        null,
        'user-1',
      );

      clubRepository.getAllClubNames.mockResolvedValue([]);
      clubRepository.save.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed',
      );

      expect(clubRepository.getAllClubNames).toHaveBeenCalledTimes(1);
      expect(clubRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should trim whitespace from club name before validation', async () => {
      const command = new CreateClubCommand(
        '  Club With Spaces  ',
        null,
        null,
        null,
        'user-1',
      );

      clubRepository.getAllClubNames.mockResolvedValue([]);

      const mockClub = new ClubBuilder()
        .withId('club-3')
        .withName('Club With Spaces')
        .build();

      clubRepository.save.mockResolvedValue(mockClub);

      const result = await handler.execute(command);

      expect(result).toBe('club-3');
      expect(clubRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Club With Spaces',
        }),
      );
    });
  });
});
