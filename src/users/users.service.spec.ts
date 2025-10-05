import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { AddSkillDto, UpdateSkillDto, UpdateUserAttributesDto } from './dto';
import { UserNotFoundException } from '../common/exceptions/user.exceptions';

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
    userAttribute: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      createMany: jest.fn(),
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

  describe('getUserAttributes', () => {
    it('should return user attributes', async () => {
      const mockAttributes = [
        {
          id: 'attr-1',
          userId: 'user-1',
          attribute: 'FITNESS',
          value: 1.2,
          assessedBy: 'admin-1',
          assessedAt: new Date(),
          notes: 'En forme',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'attr-2',
          userId: 'user-1',
          attribute: 'LEADERSHIP',
          value: 1.5,
          assessedBy: 'admin-1',
          assessedAt: new Date(),
          notes: 'Bon leader',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockDatabaseService.userAttribute.findMany.mockResolvedValue(
        mockAttributes,
      );

      const result = await service.getUserAttributes('user-1');

      expect(result).toEqual(mockAttributes);
      expect(mockDatabaseService.userAttribute.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { attribute: 'asc' },
      });
    });
  });

  describe('updateUserAttributes', () => {
    it('should update user attributes', async () => {
      const updateDto: UpdateUserAttributesDto = {
        fitness: 1.3,
        leadership: 1.6,
        notes: 'Excellente progression',
      };

      const mockUser = { id: 'user-1', email: 'test@example.com' };
      const mockUpdatedAttributes = [
        {
          id: 'attr-1',
          userId: 'user-1',
          attribute: 'FITNESS' as const,
          value: 1.3,
          assessedBy: 'admin-1',
          assessedAt: expect.any(Date) as Date,
          notes: 'Excellente progression',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'attr-2',
          userId: 'user-1',
          attribute: 'LEADERSHIP' as const,
          value: 1.6,
          assessedBy: 'admin-1',
          assessedAt: expect.any(Date) as Date,
          notes: 'Excellente progression',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockDatabaseService.user.findUnique.mockResolvedValue(mockUser);
      mockDatabaseService.userAttribute.upsert.mockResolvedValue(
        mockUpdatedAttributes[0],
      );
      mockDatabaseService.userAttribute.findMany.mockResolvedValue(
        mockUpdatedAttributes,
      );

      const result = await service.updateUserAttributes(
        'user-1',
        'admin-1',
        updateDto,
      );

      expect(result).toEqual(mockUpdatedAttributes);
      expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(mockDatabaseService.userAttribute.upsert).toHaveBeenCalledTimes(2);
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      const updateDto: UpdateUserAttributesDto = {
        fitness: 1.3,
      };

      mockDatabaseService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateUserAttributes('nonexistent-user', 'admin-1', updateDto),
      ).rejects.toThrow(UserNotFoundException);
    });

    it('should update only provided attributes', async () => {
      const updateDto: UpdateUserAttributesDto = {
        fitness: 0.8, // Seulement fitness
      };

      const mockUser = { id: 'user-1', email: 'test@example.com' };
      const mockUpdatedAttributes = [
        {
          id: 'attr-1',
          userId: 'user-1',
          attribute: 'FITNESS' as const,
          value: 0.8,
          assessedBy: 'admin-1',
          assessedAt: expect.any(Date) as Date,
          notes: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockDatabaseService.user.findUnique.mockResolvedValue(mockUser);
      mockDatabaseService.userAttribute.upsert.mockResolvedValue(
        mockUpdatedAttributes[0],
      );
      mockDatabaseService.userAttribute.findMany.mockResolvedValue(
        mockUpdatedAttributes,
      );

      await service.updateUserAttributes('user-1', 'admin-1', updateDto);

      // Devrait appeler upsert seulement 1 fois (pour fitness)
      expect(mockDatabaseService.userAttribute.upsert).toHaveBeenCalledTimes(1);
    });
  });
});
