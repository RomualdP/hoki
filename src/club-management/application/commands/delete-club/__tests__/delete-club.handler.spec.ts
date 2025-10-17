import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteClubHandler } from '../delete-club.handler';
import { DeleteClubCommand } from '../delete-club.command';
import {
  IClubRepository,
  CLUB_REPOSITORY,
} from '../../../../domain/repositories/club.repository';
import { Club } from '../../../../domain/entities/club.entity';

describe('DeleteClubHandler', () => {
  let handler: DeleteClubHandler;
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
        DeleteClubHandler,
        {
          provide: CLUB_REPOSITORY,
          useValue: mockClubRepository,
        },
      ],
    }).compile();

    handler = module.get<DeleteClubHandler>(DeleteClubHandler);
    clubRepository = module.get(CLUB_REPOSITORY);
  });

  describe('execute()', () => {
    it('should delete club successfully when requester is owner', async () => {
      const command = new DeleteClubCommand('club-1', 'owner-1');

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'owner-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      clubRepository.delete.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(clubRepository.delete).toHaveBeenCalledWith('club-1');
    });

    it('should throw NotFoundException when club does not exist', async () => {
      const command = new DeleteClubCommand('non-existent', 'owner-1');

      clubRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(command)).rejects.toThrow(
        'Club with ID non-existent not found',
      );

      expect(clubRepository.findById).toHaveBeenCalledWith('non-existent');
      expect(clubRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when requester is not the owner', async () => {
      const command = new DeleteClubCommand('club-1', 'not-owner');

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'owner-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);

      await expect(handler.execute(command)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(handler.execute(command)).rejects.toThrow(
        'Only the club owner can delete the club',
      );

      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(clubRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository delete errors', async () => {
      const command = new DeleteClubCommand('club-1', 'owner-1');

      const mockClub = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'owner-1',
      });

      clubRepository.findById.mockResolvedValue(mockClub);
      clubRepository.delete.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed',
      );

      expect(clubRepository.findById).toHaveBeenCalledWith('club-1');
      expect(clubRepository.delete).toHaveBeenCalledWith('club-1');
    });
  });
});
