import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { AddSkillDto, UpdateSkillDto } from './dto';

describe('UsersService - Skills methods', () => {
  let service: UsersService;

  const mockDatabaseService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    userSkill: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
  };

  const mockSkill = {
    id: 'skill-1',
    name: 'Service',
    category: 'SERVING',
    level: 5,
    description: 'Service skill',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserSkill = {
    id: 'user-skill-1',
    userId: 'user-1',
    skillId: 'skill-1',
    skill: mockSkill,
    level: 7,
    experienceYears: 3,
    notes: 'Good service',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserSkills', () => {
    it('should return user skills', async () => {
      const mockUserSkills = [mockUserSkill];
      mockDatabaseService.userSkill.findMany.mockResolvedValue(mockUserSkills);

      const result = await service.getUserSkills('user-1');

      expect(result).toEqual(mockUserSkills);
      expect(mockDatabaseService.userSkill.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('addSkill', () => {
    it('should add or update a skill for user', async () => {
      const addSkillDto: AddSkillDto = {
        skill: 'ATTACK',
        level: 7,
        experienceYears: 3,
        notes: 'Good service',
      };

      mockDatabaseService.userSkill.upsert.mockResolvedValue(mockUserSkill);

      const result = await service.addSkill('user-1', addSkillDto);

      expect(result).toEqual(mockUserSkill);
      expect(mockDatabaseService.userSkill.upsert).toHaveBeenCalledWith({
        where: {
          userId_skill: {
            userId: 'user-1',
            skill: 'ATTACK',
          },
        },
        update: {
          level: 7,
          experienceYears: 3,
          notes: 'Good service',
          updatedAt: expect.any(Date), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        },
        create: {
          userId: 'user-1',
          skill: 'ATTACK',
          level: 7,
          experienceYears: 3,
          notes: 'Good service',
        },
      });
    });
  });

  describe('updateSkill', () => {
    it('should update a user skill', async () => {
      const updateSkillDto: UpdateSkillDto = {
        level: 8,
        notes: 'Excellent service',
      };

      const updatedUserSkill = {
        ...mockUserSkill,
        ...updateSkillDto,
        updatedAt: new Date(),
      };

      mockDatabaseService.userSkill.update.mockResolvedValue(updatedUserSkill);

      const result = await service.updateSkill(
        'user-1',
        'ATTACK',
        updateSkillDto,
      );

      expect(result).toEqual(updatedUserSkill);
      expect(mockDatabaseService.userSkill.update).toHaveBeenCalledWith({
        where: {
          userId_skill: {
            userId: 'user-1',
            skill: 'ATTACK',
          },
        },
        data: updateSkillDto,
      });
    });
  });

  describe('removeSkill', () => {
    it('should remove a user skill', async () => {
      mockDatabaseService.userSkill.delete.mockResolvedValue(mockUserSkill);

      const result = await service.removeSkill('user-1', 'ATTACK');

      expect(result).toEqual(mockUserSkill);
      expect(mockDatabaseService.userSkill.delete).toHaveBeenCalledWith({
        where: {
          userId_skill: {
            userId: 'user-1',
            skill: 'ATTACK',
          },
        },
      });
    });
  });
});
