import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { QueryUsersDto } from './dto';

describe('UsersService - findAll', () => {
  let service: UsersService;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: null,
    password: 'hashedPassword',
    role: 'USER' as const,
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProfile = {
    id: 'profile-1',
    userId: 'user-1',
    biography: null,
    birthDate: null,
    gender: null,
    position: 'SETTER' as const,
    height: 180,
    weight: 75,
    phoneNumber: null,
    city: 'Paris',
    country: null,
    preferredHand: 'RIGHT' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAttributes = [
    {
      id: 'attr-1',
      userId: 'user-1',
      attribute: 'FITNESS' as const,
      value: 1.0,
      assessedBy: null,
      assessedAt: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockDatabaseService = {
    user: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    userProfile: {
      create: jest.fn(),
    },
    userAttribute: {
      createMany: jest.fn(),
    },
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

  describe('findAll without filters', () => {
    it('should return paginated users with profiles', async () => {
      const query: QueryUsersDto = { page: 1, limit: 10 };
      const mockUsers = [
        {
          ...mockUser,
          profile: mockProfile,
          attributes: mockAttributes,
          _count: { skills: 0, teamMemberships: 0 },
        },
      ];

      mockDatabaseService.user.findMany.mockResolvedValue(mockUsers);
      mockDatabaseService.user.count.mockResolvedValue(1);

      const result = await service.findAll(query);

      expect(result.data).toEqual(mockUsers);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(mockDatabaseService.user.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        include: {
          profile: true,
          attributes: true,
          _count: {
            select: {
              skills: true,
              teamMemberships: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle users without profiles', async () => {
      const query: QueryUsersDto = { page: 1, limit: 10 };
      const mockUsers = [
        {
          ...mockUser,
          profile: null,
          attributes: mockAttributes,
          _count: { skills: 0, teamMemberships: 0 },
        },
      ];

      mockDatabaseService.user.findMany.mockResolvedValue(mockUsers);
      mockDatabaseService.user.count.mockResolvedValue(1);

      const result = await service.findAll(query);

      expect(result.data).toEqual(mockUsers);
      expect(result.data[0].profile).toBeNull();
    });

    it('should apply pagination correctly', async () => {
      const query: QueryUsersDto = { page: 2, limit: 5 };
      const mockUsers = [
        {
          ...mockUser,
          profile: mockProfile,
          attributes: mockAttributes,
          _count: { skills: 0, teamMemberships: 0 },
        },
      ];

      mockDatabaseService.user.findMany.mockResolvedValue(mockUsers);
      mockDatabaseService.user.count.mockResolvedValue(15);

      const result = await service.findAll(query);

      expect(result.meta).toEqual({
        total: 15,
        page: 2,
        limit: 5,
        totalPages: 3,
      });
      expect(mockDatabaseService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        }),
      );
    });
  });

  describe('findAll with name filter', () => {
    it('should filter by name (case insensitive)', async () => {
      const query: QueryUsersDto = { page: 1, limit: 10, name: 'john' };
      const mockUsers = [
        {
          ...mockUser,
          profile: mockProfile,
          attributes: mockAttributes,
          _count: { skills: 0, teamMemberships: 0 },
        },
      ];

      mockDatabaseService.user.findMany.mockResolvedValue(mockUsers);
      mockDatabaseService.user.count.mockResolvedValue(1);

      await service.findAll(query);

      expect(mockDatabaseService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { firstName: { contains: 'john', mode: 'insensitive' } },
              { lastName: { contains: 'john', mode: 'insensitive' } },
            ],
          },
        }),
      );
    });
  });

  describe('findAll with email filter', () => {
    it('should filter by email (case insensitive)', async () => {
      const query: QueryUsersDto = {
        page: 1,
        limit: 10,
        email: 'test@example',
      };
      const mockUsers = [
        {
          ...mockUser,
          profile: mockProfile,
          attributes: mockAttributes,
          _count: { skills: 0, teamMemberships: 0 },
        },
      ];

      mockDatabaseService.user.findMany.mockResolvedValue(mockUsers);
      mockDatabaseService.user.count.mockResolvedValue(1);

      await service.findAll(query);

      expect(mockDatabaseService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            email: { contains: 'test@example', mode: 'insensitive' },
          }) as Record<string, unknown>,
        }) as Record<string, unknown>,
      );
    });
  });

  describe('findAll with city filter', () => {
    it('should filter by city when users have profiles', async () => {
      const query: QueryUsersDto = { page: 1, limit: 10, city: 'Paris' };
      const mockUsers = [
        {
          ...mockUser,
          profile: mockProfile,
          attributes: mockAttributes,
          _count: { skills: 0, teamMemberships: 0 },
        },
      ];

      mockDatabaseService.user.findMany.mockResolvedValue(mockUsers);
      mockDatabaseService.user.count.mockResolvedValue(1);

      await service.findAll(query);

      expect(mockDatabaseService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            profile: {
              city: { contains: 'Paris', mode: 'insensitive' },
            },
          }) as Record<string, unknown>,
        }) as Record<string, unknown>,
      );
    });

    it('should return empty results when filtering by city on users without profiles', async () => {
      const query: QueryUsersDto = { page: 1, limit: 10, city: 'Paris' };

      mockDatabaseService.user.findMany.mockResolvedValue([]);
      mockDatabaseService.user.count.mockResolvedValue(0);

      const result = await service.findAll(query);

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('findAll with position filter', () => {
    it('should filter by position when users have profiles', async () => {
      const query: QueryUsersDto = { page: 1, limit: 10, position: 'SETTER' };
      const mockUsers = [
        {
          ...mockUser,
          profile: mockProfile,
          attributes: mockAttributes,
          _count: { skills: 0, teamMemberships: 0 },
        },
      ];

      mockDatabaseService.user.findMany.mockResolvedValue(mockUsers);
      mockDatabaseService.user.count.mockResolvedValue(1);

      await service.findAll(query);

      expect(mockDatabaseService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            profile: {
              position: 'SETTER',
            },
          }) as Record<string, unknown>,
        }) as Record<string, unknown>,
      );
    });
  });

  describe('findAll with combined filters', () => {
    it('should apply city and position filters together', async () => {
      const query: QueryUsersDto = {
        page: 1,
        limit: 10,
        city: 'Paris',
        position: 'SETTER',
      };
      const mockUsers = [
        {
          ...mockUser,
          profile: mockProfile,
          attributes: mockAttributes,
          _count: { skills: 0, teamMemberships: 0 },
        },
      ];

      mockDatabaseService.user.findMany.mockResolvedValue(mockUsers);
      mockDatabaseService.user.count.mockResolvedValue(1);

      await service.findAll(query);

      expect(mockDatabaseService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            profile: {
              city: { contains: 'Paris', mode: 'insensitive' },
              position: 'SETTER',
            },
          }) as Record<string, unknown>,
        }) as Record<string, unknown>,
      );
    });

    it('should apply all filters together', async () => {
      const query: QueryUsersDto = {
        page: 1,
        limit: 10,
        name: 'john',
        email: 'test',
        city: 'Paris',
        position: 'SETTER',
      };
      const mockUsers = [
        {
          ...mockUser,
          profile: mockProfile,
          attributes: mockAttributes,
          _count: { skills: 0, teamMemberships: 0 },
        },
      ];

      mockDatabaseService.user.findMany.mockResolvedValue(mockUsers);
      mockDatabaseService.user.count.mockResolvedValue(1);

      await service.findAll(query);

      expect(mockDatabaseService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { firstName: { contains: 'john', mode: 'insensitive' } },
              { lastName: { contains: 'john', mode: 'insensitive' } },
            ],
            email: { contains: 'test', mode: 'insensitive' },
            profile: {
              city: { contains: 'Paris', mode: 'insensitive' },
              position: 'SETTER',
            },
          },
        }),
      );
    });
  });

  describe('create', () => {
    it('should create user with profile and attributes automatically', async () => {
      const createUserDto = {
        email: 'new@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'hashedPassword',
      };

      const createdUser = { ...mockUser, id: 'new-user', ...createUserDto };
      const createdProfile = {
        ...mockProfile,
        id: 'new-profile',
        userId: 'new-user',
      };

      mockDatabaseService.user.create.mockResolvedValue(createdUser);
      mockDatabaseService.userProfile.create.mockResolvedValue(createdProfile);
      mockDatabaseService.userAttribute.createMany.mockResolvedValue({
        count: 2,
      });
      mockDatabaseService.user.findUnique.mockResolvedValue({
        ...createdUser,
        profile: createdProfile,
      });

      const result = await service.create(createUserDto);

      expect(mockDatabaseService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
        include: { profile: true },
      });

      expect(mockDatabaseService.userProfile.create).toHaveBeenCalledWith({
        data: { userId: 'new-user' },
      });

      expect(mockDatabaseService.userAttribute.createMany).toHaveBeenCalledWith(
        {
          data: [
            { userId: 'new-user', attribute: 'FITNESS', value: 1.0 },
            { userId: 'new-user', attribute: 'LEADERSHIP', value: 1.0 },
          ],
        },
      );

      expect(result?.profile).toBeDefined();
    });
  });
});
