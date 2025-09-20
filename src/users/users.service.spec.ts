import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { AddSkillDto, UpdateSkillDto } from './dto';

describe('UsersService - Skills methods', () => {
  let service: UsersService;

  const mockPrismaService = {
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
          provide: PrismaService,
          useValue: mockPrismaService,
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
      mockPrismaService.userSkill.findMany.mockResolvedValue(mockUserSkills);

      const result = await service.getUserSkills('user-1');

      expect(result).toEqual(mockUserSkills);
      expect(mockPrismaService.userSkill.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: { skill: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('addSkill', () => {
    it('should add or update a skill for user', async () => {
      const addSkillDto: AddSkillDto = {
        skillId: 'skill-1',
        level: 7,
        experienceYears: 3,
        notes: 'Good service',
      };

      mockPrismaService.userSkill.upsert.mockResolvedValue(mockUserSkill);

      const result = await service.addSkill('user-1', addSkillDto);

      expect(result).toEqual(mockUserSkill);
      expect(mockPrismaService.userSkill.upsert).toHaveBeenCalledWith({
        where: {
          userId_skillId: {
            userId: 'user-1',
            skillId: 'skill-1',
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
          skillId: 'skill-1',
          level: 7,
          experienceYears: 3,
          notes: 'Good service',
        },
        include: { skill: true },
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

      mockPrismaService.userSkill.update.mockResolvedValue(updatedUserSkill);

      const result = await service.updateSkill(
        'user-1',
        'skill-1',
        updateSkillDto,
      );

      expect(result).toEqual(updatedUserSkill);
      expect(mockPrismaService.userSkill.update).toHaveBeenCalledWith({
        where: {
          userId_skillId: {
            userId: 'user-1',
            skillId: 'skill-1',
          },
        },
        data: updateSkillDto,
        include: { skill: true },
      });
    });
  });

  describe('removeSkill', () => {
    it('should remove a user skill', async () => {
      mockPrismaService.userSkill.delete.mockResolvedValue(mockUserSkill);

      const result = await service.removeSkill('user-1', 'skill-1');

      expect(result).toEqual(mockUserSkill);
      expect(mockPrismaService.userSkill.delete).toHaveBeenCalledWith({
        where: {
          userId_skillId: {
            userId: 'user-1',
            skillId: 'skill-1',
          },
        },
      });
    });
  });
});
