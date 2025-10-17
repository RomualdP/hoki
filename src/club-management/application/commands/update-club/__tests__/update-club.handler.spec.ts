import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UpdateClubHandler } from '../update-club.handler';
import { UpdateClubCommand } from '../update-club.command';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../../domain/repositories/club.repository';
import { Club } from '../../../../domain/entities/club.entity';

describe('UpdateClubHandler', () => {
  let handler: UpdateClubHandler;
  let clubRepository: jest.Mocked<IClubRepository>;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateClubHandler,
        {
          provide: CLUB_REPOSITORY,
          useValue: mockClubRepository,
        },
      ],
    }).compile();

    handler = module.get<UpdateClubHandler>(UpdateClubHandler);
    clubRepository = module.get(CLUB_REPOSITORY);
  });

  describe('execute()', () => {
    it('should update club name successfully', async () => {
      const command = new UpdateClubCommand(
        'club-1',
        'Updated Volleyball Club',
      );

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Original Club',
        ownerId: 'user-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      clubRepository.update.mockResolvedValue(mockClub);

      await handler.execute(command);

      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(clubRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'club-1',
          name: 'Updated Volleyball Club',
        }),
      );
    });

    it('should update all club fields successfully', async () => {
      const command = new UpdateClubCommand(
        'club-1',
        'Updated Club',
        'New description',
        'https://example.com/new-logo.png',
        'New York, USA',
      );

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Original Club',
        ownerId: 'user-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      clubRepository.update.mockResolvedValue(mockClub);

      await handler.execute(command);

      expect(clubRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'club-1',
          name: 'Updated Club',
          description: 'New description',
          logo: 'https://example.com/new-logo.png',
          location: 'New York, USA',
        }),
      );
    });

    it('should update only specific fields (partial update)', async () => {
      const command = new UpdateClubCommand(
        'club-1',
        undefined,
        'Updated description only',
      );

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Volleyball Club',
        description: 'Old description',
        ownerId: 'user-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      clubRepository.update.mockResolvedValue(mockClub);

      await handler.execute(command);

      expect(clubRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'club-1',
          name: 'Volleyball Club', // unchanged
          description: 'Updated description only',
        }),
      );
    });

    it('should set fields to null when explicitly provided', async () => {
      const command = new UpdateClubCommand(
        'club-1',
        undefined,
        null,
        null,
        null,
      );

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Volleyball Club',
        description: 'Some description',
        logo: 'https://example.com/logo.png',
        location: 'Paris',
        ownerId: 'user-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      clubRepository.update.mockResolvedValue(mockClub);

      await handler.execute(command);

      expect(clubRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'club-1',
          description: null,
          logo: null,
          location: null,
        }),
      );
    });

    it('should throw NotFoundException when club does not exist', async () => {
      const command = new UpdateClubCommand('non-existent', 'New Name');

      clubRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        'Club with ID non-existent not found',
      );

      expect(clubRepository.findById).toHaveBeenCalledWith('non-existent');
      expect(clubRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error when name is empty', async () => {
      const command = new UpdateClubCommand('club-1', '   ');

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Original Club',
        ownerId: 'user-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);

      await expect(handler.execute(command)).rejects.toThrow(
        'Club name cannot be empty',
      );

      expect(clubRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const command = new UpdateClubCommand('club-1', 'Updated Name');

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Original Club',
        ownerId: 'user-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      clubRepository.update.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed',
      );

      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(clubRepository.update).toHaveBeenCalled();
    });
  });
});
