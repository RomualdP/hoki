import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateSkillDto, UpdateSkillDto, QuerySkillsDto } from './dto';

describe('SkillsService', () => {
  let service: SkillsService;

  const mockPrismaService = {
    skill: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockSkill = {
    id: '1',
    name: 'Service ace',
    description: 'Excellent service technique',
    category: 'SERVING',
    level: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SkillsService>(SkillsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return skills with pagination metadata', async () => {
      const mockSkills = [mockSkill];
      const mockTotal = 1;
      const query: QuerySkillsDto = { page: 1, limit: 10 };

      mockPrismaService.skill.findMany.mockResolvedValue(mockSkills);
      mockPrismaService.skill.count.mockResolvedValue(mockTotal);

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: mockSkills,
        meta: {
          total: mockTotal,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
      expect(mockPrismaService.skill.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        include: {
          _count: {
            select: {
              userSkills: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });
    });

    it('should apply filters when provided', async () => {
      const query: QuerySkillsDto = {
        page: 1,
        limit: 10,
        category: 'SERVING',
        level: 5,
        isActive: 'true',
      };

      mockPrismaService.skill.findMany.mockResolvedValue([]);
      mockPrismaService.skill.count.mockResolvedValue(0);

      await service.findAll(query);

      expect(mockPrismaService.skill.findMany).toHaveBeenCalledWith({
        where: {
          category: 'SERVING',
          level: 5,
          isActive: true,
        },
        skip: 0,
        take: 10,
        include: {
          _count: {
            select: {
              userSkills: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });
    });

    it('should handle pagination correctly', async () => {
      const query: QuerySkillsDto = { page: 2, limit: 5 };

      mockPrismaService.skill.findMany.mockResolvedValue([]);
      mockPrismaService.skill.count.mockResolvedValue(10);

      await service.findAll(query);

      expect(mockPrismaService.skill.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 5,
        take: 5,
        include: {
          _count: {
            select: {
              userSkills: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a skill when found', async () => {
      const mockSkillWithRelations = {
        ...mockSkill,
        userSkills: [],
      };

      mockPrismaService.skill.findUnique.mockResolvedValue(
        mockSkillWithRelations,
      );

      const result = await service.findOne('1');

      expect(result).toEqual(mockSkillWithRelations);
      expect(mockPrismaService.skill.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          userSkills: {
            include: { user: true },
          },
        },
      });
    });

    it('should throw NotFoundException when skill not found', async () => {
      mockPrismaService.skill.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(
        new NotFoundException('Skill with ID 999 not found'),
      );
    });
  });

  describe('create', () => {
    it('should create a new skill', async () => {
      const createSkillDto: CreateSkillDto = {
        name: 'New Skill',
        description: 'New skill description',
        category: 'ATTACK',
        level: 3,
        isActive: true,
      };

      mockPrismaService.skill.create.mockResolvedValue({
        id: '2',
        ...createSkillDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(createSkillDto);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe(createSkillDto.name);
      expect(mockPrismaService.skill.create).toHaveBeenCalledWith({
        data: createSkillDto,
      });
    });
  });

  describe('update', () => {
    it('should update an existing skill', async () => {
      const updateSkillDto: UpdateSkillDto = {
        name: 'Updated Skill',
        level: 4,
      };

      mockPrismaService.skill.findUnique.mockResolvedValue(mockSkill);
      mockPrismaService.skill.update.mockResolvedValue({
        ...mockSkill,
        ...updateSkillDto,
        updatedAt: new Date(),
      });

      const result = await service.update('1', updateSkillDto);

      expect(result.name).toBe(updateSkillDto.name);
      expect(result.level).toBe(updateSkillDto.level);
      expect(mockPrismaService.skill.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateSkillDto,
      });
    });

    it('should throw NotFoundException when skill not found', async () => {
      mockPrismaService.skill.findUnique.mockResolvedValue(null);

      await expect(service.update('999', { name: 'Updated' })).rejects.toThrow(
        new NotFoundException('Skill with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should delete an existing skill', async () => {
      mockPrismaService.skill.findUnique.mockResolvedValue(mockSkill);
      mockPrismaService.skill.delete.mockResolvedValue(mockSkill);

      const result = await service.remove('1');

      expect(result).toEqual(mockSkill);
      expect(mockPrismaService.skill.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException when skill not found', async () => {
      mockPrismaService.skill.findUnique.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(
        new NotFoundException('Skill with ID 999 not found'),
      );
    });
  });
});
