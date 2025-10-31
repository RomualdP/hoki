import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AddSkillDto, UpdateSkillDto } from './dto';

describe('UsersController - Skills endpoints', () => {
  let controller: UsersController;

  const mockUsersService = {
    getUserSkills: jest.fn(),
    addSkill: jest.fn(),
    updateSkill: jest.fn(),
    removeSkill: jest.fn(),
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
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserSkills', () => {
    it('should return user skills with success format', async () => {
      const mockUserSkills = [mockUserSkill];
      mockUsersService.getUserSkills.mockResolvedValue(mockUserSkills);

      const result = await controller.getUserSkills('user-1');

      expect(result).toEqual({
        success: true,
        data: mockUserSkills,
        message: 'Compétences récupérées avec succès',
      });
      expect(mockUsersService.getUserSkills).toHaveBeenCalledWith('user-1');
    });
  });

  describe('addSkill', () => {
    it('should add skill and return with success format', async () => {
      const addSkillDto: AddSkillDto = {
        skill: 'ATTACK',
        level: 7,
        experienceYears: 3,
        notes: 'Good service',
      };

      mockUsersService.addSkill.mockResolvedValue(mockUserSkill);

      const result = await controller.addSkill('user-1', addSkillDto);

      expect(result).toEqual({
        success: true,
        data: mockUserSkill,
        message: 'Compétence ajoutée avec succès',
      });
      expect(mockUsersService.addSkill).toHaveBeenCalledWith(
        'user-1',
        addSkillDto,
      );
    });
  });

  describe('updateSkill', () => {
    it('should update skill and return with success format', async () => {
      const updateSkillDto: UpdateSkillDto = {
        level: 8,
        notes: 'Excellent service',
      };

      const updatedUserSkill = {
        ...mockUserSkill,
        ...updateSkillDto,
        updatedAt: new Date(),
      };

      mockUsersService.updateSkill.mockResolvedValue(updatedUserSkill);

      const result = await controller.updateSkill(
        'user-1',
        'skill-1',
        updateSkillDto,
      );

      expect(result).toEqual({
        success: true,
        data: updatedUserSkill,
        message: 'Compétence mise à jour avec succès',
      });
      expect(mockUsersService.updateSkill).toHaveBeenCalledWith(
        'user-1',
        'skill-1',
        updateSkillDto,
      );
    });
  });

  describe('removeSkill', () => {
    it('should remove skill and return success message', async () => {
      mockUsersService.removeSkill.mockResolvedValue(undefined);

      const result = await controller.removeSkill('user-1', 'skill-1');

      expect(result).toEqual({
        success: true,
        message: 'Compétence supprimée avec succès',
      });
      expect(mockUsersService.removeSkill).toHaveBeenCalledWith(
        'user-1',
        'skill-1',
      );
    });
  });
});
