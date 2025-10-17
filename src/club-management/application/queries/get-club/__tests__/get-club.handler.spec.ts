import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetClubHandler } from '../get-club.handler';
import { GetClubQuery } from '../get-club.query';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../../domain/repositories/club.repository';
import { Club } from '../../../../domain/entities/club.entity';

describe('GetClubHandler', () => {
  let handler: GetClubHandler;
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
        GetClubHandler,
        {
          provide: CLUB_REPOSITORY,
          useValue: mockClubRepository,
        },
      ],
    }).compile();

    handler = module.get<GetClubHandler>(GetClubHandler);
    clubRepository = module.get(CLUB_REPOSITORY);
  });

  describe('execute()', () => {
    it('should return club detail read model when club exists', async () => {
      const query = new GetClubQuery('club-1');

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Volleyball Club',
        description: 'A great club',
        logo: 'https://example.com/logo.png',
        location: 'Paris, France',
        ownerId: 'user-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);

      const result = await handler.execute(query);

      expect(result).toEqual({
        id: 'club-1',
        name: 'Test Volleyball Club',
        description: 'A great club',
        logo: 'https://example.com/logo.png',
        location: 'Paris, France',
        ownerId: 'user-1',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
    });

    it('should return club with null optional fields', async () => {
      const query = new GetClubQuery('club-2');

      const mockClub = Club.create({
        id: 'club-2',
        name: 'Simple Club',
        ownerId: 'user-2',
      });

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

    it('should throw NotFoundException when club does not exist', async () => {
      const query = new GetClubQuery('non-existent-club');

      clubRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(query)).rejects.toThrow(
        'Club with ID non-existent-club not found',
      );

      expect(clubRepository.findById).toHaveBeenCalledWith('non-existent-club');
    });

    it('should handle repository errors', async () => {
      const query = new GetClubQuery('club-1');

      clubRepository.findById.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed',
      );

      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
    });

    it('should return read model with correct date types', async () => {
      const query = new GetClubQuery('club-3');

      const createdAt = new Date('2025-01-01');
      const updatedAt = new Date('2025-01-15');

      const mockClub = Club.reconstitute({
        id: 'club-3',
        name: 'Test Club',
        description: null,
        logo: null,
        location: null,
        ownerId: 'user-3',
        createdAt,
        updatedAt,
      });

      clubRepository.findById.mockResolvedValue(mockClub);

      const result = await handler.execute(query);

      expect(result.createdAt).toEqual(createdAt);
      expect(result.updatedAt).toEqual(updatedAt);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });
});
