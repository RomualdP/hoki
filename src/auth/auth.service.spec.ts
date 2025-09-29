import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './types/user.type';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
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
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              upsert: jest.fn(),
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
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const findUniqueMock = jest.fn().mockResolvedValue(mockUser);
      const compareMock = jest.fn().mockResolvedValue(true);

      prismaService.user.findUnique = findUniqueMock;
      (bcrypt.compare as jest.Mock) = compareMock;

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should return null if user is not found', async () => {
      const findUniqueMock = jest.fn().mockResolvedValue(null);
      prismaService.user.findUnique = findUniqueMock;

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const findUniqueMock = jest.fn().mockResolvedValue(mockUser);
      const compareMock = jest.fn().mockResolvedValue(false);

      prismaService.user.findUnique = findUniqueMock;
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
    it('should create a new user and return user without password', async () => {
      const findUniqueMock = jest.fn().mockResolvedValue(null);
      const createMock = jest.fn().mockResolvedValue(mockUser);
      const hashMock = jest.fn().mockResolvedValue('hashedPassword');

      prismaService.user.findUnique = findUniqueMock;
      prismaService.user.create = createMock;
      (bcrypt.hash as jest.Mock) = hashMock;

      const result = await service.register(
        'test@example.com',
        'password',
        'Test User',
      );
      expect(result).toEqual(mockUserWithoutPassword);
      expect(createMock).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if email already exists', async () => {
      const findUniqueMock = jest.fn().mockResolvedValue(mockUser);
      prismaService.user.findUnique = findUniqueMock;

      await expect(
        service.register('test@example.com', 'password', 'Test User'),
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('validateGoogleUser', () => {
    it('should create or update user with Google profile', async () => {
      const googleProfile = {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/photo.jpg',
      };

      const upsertMock = jest.fn().mockResolvedValue(mockUser);
      prismaService.user.upsert = upsertMock;

      const result = await service.validateGoogleUser(googleProfile);
      expect(result).toEqual(mockUser);

      expect(upsertMock).toHaveBeenCalledWith({
        where: { email: googleProfile.email },
        update: {
          firstName: 'Test',
          lastName: 'User',
          avatar: googleProfile.picture,
          lastLoginAt: expect.any(Date) as Date,
        },
        create: {
          email: googleProfile.email,
          firstName: 'Test',
          lastName: 'User',
          avatar: googleProfile.picture,
          lastLoginAt: expect.any(Date) as Date,
        },
      });
    });
  });
});
