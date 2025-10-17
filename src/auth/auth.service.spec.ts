import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './types/user.type';

describe('AuthService', () => {
  let service: AuthService;
  let databaseService: DatabaseService;
  let jwtService: JwtService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    avatar: null,
    role: 'USER',
    isActive: true,
    lastLoginAt: null,
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithoutPassword = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    avatar: null,
    role: 'USER',
    isActive: true,
    lastLoginAt: null,
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DatabaseService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              upsert: jest.fn(),
            },
            userProfile: {
              create: jest.fn(),
            },
            userAttribute: {
              createMany: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mock_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const findUniqueMock = jest.fn().mockResolvedValue(mockUser);
      const compareMock = jest.fn().mockResolvedValue(true);

      databaseService.user.findUnique = findUniqueMock;
      (bcrypt.compare as jest.Mock) = compareMock;

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should return null if user is not found', async () => {
      const findUniqueMock = jest.fn().mockResolvedValue(null);
      databaseService.user.findUnique = findUniqueMock;

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const findUniqueMock = jest.fn().mockResolvedValue(mockUser);
      const compareMock = jest.fn().mockResolvedValue(false);

      databaseService.user.findUnique = findUniqueMock;
      (bcrypt.compare as jest.Mock) = compareMock;

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return JWT token', async () => {
      const signAsyncMock = jest.fn().mockResolvedValue('mock_token');
      jwtService.signAsync = signAsyncMock;

      // @ts-expect-error mockUserWithoutPassword is not defined
      const result = await service.login(mockUserWithoutPassword);
      expect(result).toEqual({ access_token: 'mock_token' });

      const expectedPayload = {
        email: mockUserWithoutPassword.email,
        sub: mockUserWithoutPassword.id,
      };
      expect(signAsyncMock).toHaveBeenCalledWith(expectedPayload);
    });
  });

  describe('register', () => {
    it('should create a new user with profile and attributes', async () => {
      const findUniqueMock = jest.fn().mockResolvedValue(null);
      const createMock = jest.fn().mockResolvedValue(mockUser);
      const createProfileMock = jest
        .fn()
        .mockResolvedValue({ id: 'profile-1', userId: '1' });
      const createManyMock = jest.fn().mockResolvedValue({ count: 2 });
      const hashMock = jest.fn().mockResolvedValue('hashedPassword');

      databaseService.user.findUnique = findUniqueMock;
      databaseService.user.create = createMock;
      databaseService.userProfile.create = createProfileMock;
      databaseService.userAttribute.createMany = createManyMock;
      (bcrypt.hash as jest.Mock) = hashMock;

      const result = await service.register(
        'test@example.com',
        'password',
        'Test',
        'User',
      );

      expect(result).toEqual(mockUserWithoutPassword);
      expect(createMock).toHaveBeenCalled();
      expect(createProfileMock).toHaveBeenCalledWith({
        data: { userId: '1' },
      });
      expect(createManyMock).toHaveBeenCalledWith({
        data: [
          { userId: '1', attribute: 'FITNESS', value: 1.0 },
          { userId: '1', attribute: 'LEADERSHIP', value: 1.0 },
        ],
      });
    });

    it('should throw UnauthorizedException if email already exists', async () => {
      const findUniqueMock = jest.fn().mockResolvedValue(mockUser);
      databaseService.user.findUnique = findUniqueMock;

      await expect(
        service.register('test@example.com', 'password', 'Test', 'User'),
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('validateGoogleUser', () => {
    it('should update existing user without creating profile', async () => {
      const googleProfile = {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/photo.jpg',
      };

      const findUniqueMock = jest.fn().mockResolvedValue(mockUser);
      const updateMock = jest.fn().mockResolvedValue(mockUser);

      databaseService.user.findUnique = findUniqueMock;
      databaseService.user.update = updateMock;

      const result = await service.validateGoogleUser(googleProfile);
      expect(result).toEqual(mockUser);

      expect(updateMock).toHaveBeenCalledWith({
        where: { email: googleProfile.email },
        data: {
          firstName: 'Test',
          lastName: 'User',
          avatar: googleProfile.picture,
          lastLoginAt: expect.any(Date) as Date,
        },
      });
    });

    it('should create new user with profile and attributes for Google OAuth', async () => {
      const googleProfile = {
        email: 'new@example.com',
        name: 'New User',
        picture: 'https://example.com/photo.jpg',
      };

      const newUser = {
        ...mockUser,
        id: 'new-user-id',
        email: 'new@example.com',
      };

      const findUniqueMock = jest.fn().mockResolvedValue(null);
      const createMock = jest.fn().mockResolvedValue(newUser);
      const createProfileMock = jest
        .fn()
        .mockResolvedValue({ id: 'profile-1', userId: 'new-user-id' });
      const createManyMock = jest.fn().mockResolvedValue({ count: 2 });

      databaseService.user.findUnique = findUniqueMock;
      databaseService.user.create = createMock;
      databaseService.userProfile.create = createProfileMock;
      databaseService.userAttribute.createMany = createManyMock;

      const result = await service.validateGoogleUser(googleProfile);

      expect(result).toEqual(newUser);
      expect(createMock).toHaveBeenCalledWith({
        data: {
          email: googleProfile.email,
          firstName: 'New',
          lastName: 'User',
          avatar: googleProfile.picture,
          lastLoginAt: expect.any(Date) as Date,
        },
      });
      expect(createProfileMock).toHaveBeenCalledWith({
        data: { userId: 'new-user-id' },
      });
      expect(createManyMock).toHaveBeenCalledWith({
        data: [
          { userId: 'new-user-id', attribute: 'FITNESS', value: 1.0 },
          { userId: 'new-user-id', attribute: 'LEADERSHIP', value: 1.0 },
        ],
      });
    });
  });
});
