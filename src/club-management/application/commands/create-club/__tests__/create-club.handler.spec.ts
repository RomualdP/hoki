import { Test, TestingModule } from '@nestjs/testing';
import { CreateClubHandler } from '../create-club.handler';
import { CreateClubCommand } from '../create-club.command';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../../domain/repositories/club.repository';
import { Club } from '../../../../domain/entities/club.entity';

describe('CreateClubHandler', () => {
  let handler: CreateClubHandler;
  let clubRepository: jest.Mocked<IClubRepository>;

  beforeEach(async () => {
    // Create mock repository
    const mockClubRepository: jest.Mocked<IClubRepository> = {
      save: jest.fn(),
      findById: jest.fn(),
      findByOwnerId: jest.fn(),
      findAll: jest.fn(),
      existsByName: jest.fn(),
      getAllClubNames: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateClubHandler,
        {
          provide: CLUB_REPOSITORY,
          useValue: mockClubRepository,
        },
      ],
    }).compile();

    handler = module.get<CreateClubHandler>(CreateClubHandler);
    clubRepository = module.get(CLUB_REPOSITORY);
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

      const mockClub = Club.create({
        id: 'club-1',
        name: command.name,
        description: command.description || undefined,
        logo: command.logo || undefined,
        location: command.location || undefined,
        ownerId: command.ownerId,
      });

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

      const mockClub = Club.create({
        id: 'club-2',
        name: command.name,
        ownerId: command.ownerId,
      });

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

      const mockClub = Club.create({
        id: 'club-3',
        name: 'Club With Spaces',
        ownerId: 'user-1',
      });

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
