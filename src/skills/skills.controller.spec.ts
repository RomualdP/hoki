import { Test, TestingModule } from '@nestjs/testing';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { CreateSkillDto, UpdateSkillDto, QuerySkillsDto } from './dto';

describe('SkillsController', () => {
  let controller: SkillsController;
  let service: SkillsService;

  const mockSkillsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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
      controllers: [SkillsController],
      providers: [
        {
          provide: SkillsService,
          useValue: mockSkillsService,
        },
      ],
    }).compile();

    controller = module.get<SkillsController>(SkillsController);
    service = module.get<SkillsService>(SkillsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of skills with pagination', async () => {
      const query: QuerySkillsDto = { page: 1, limit: 10 };
      const expectedResult = {
        data: [mockSkill],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockSkillsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(result).toEqual(expectedResult);
      expect(mockSkillsService.findAll).toHaveBeenCalledWith(query);
    });

    it('should pass filters to the service', async () => {
      const query: QuerySkillsDto = {
        page: 1,
        limit: 10,
        category: 'SERVING',
        level: 5,
        isActive: 'true',
      };

      mockSkillsService.findAll.mockResolvedValue({ data: [], meta: {} });

      await controller.findAll(query);

      expect(mockSkillsService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single skill', async () => {
      const skillId = '1';
      mockSkillsService.findOne.mockResolvedValue(mockSkill);

      const result = await controller.findOne(skillId);

      expect(result).toEqual(mockSkill);
      expect(mockSkillsService.findOne).toHaveBeenCalledWith(skillId);
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

      const expectedResult = {
        id: '2',
        ...createSkillDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSkillsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createSkillDto);

      expect(result).toEqual(expectedResult);
      expect(mockSkillsService.create).toHaveBeenCalledWith(createSkillDto);
    });
  });

  describe('update', () => {
    it('should update an existing skill', async () => {
      const skillId = '1';
      const updateSkillDto: UpdateSkillDto = {
        name: 'Updated Skill',
        level: 4,
      };

      const expectedResult = {
        ...mockSkill,
        ...updateSkillDto,
        updatedAt: new Date(),
      };

      mockSkillsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(skillId, updateSkillDto);

      expect(result).toEqual(expectedResult);
      expect(mockSkillsService.update).toHaveBeenCalledWith(skillId, updateSkillDto);
    });
  });

  describe('remove', () => {
    it('should remove an existing skill', async () => {
      const skillId = '1';
      mockSkillsService.remove.mockResolvedValue(mockSkill);

      const result = await controller.remove(skillId);

      expect(result).toEqual(mockSkill);
      expect(mockSkillsService.remove).toHaveBeenCalledWith(skillId);
    });
  });
});
