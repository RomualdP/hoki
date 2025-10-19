import {
  Injectable,
  UnauthorizedException as ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import {
  User,
  UserPayload,
  GoogleProfile,
  UserWithoutPassword,
} from './types/user.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private database: DatabaseService,
    private jwtService: JwtService,
  ) {}

  private excludePassword(user: User): UserWithoutPassword {
    const userCopy = { ...user } as Record<string, unknown>;
    delete userCopy.password;
    return userCopy as UserWithoutPassword;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.database.user.findUnique({ where: { email } });
    if (user?.password && (await bcrypt.compare(password, user.password))) {
      return this.excludePassword(user);
    }
    return null;
  }

  async login(user: UserWithoutPassword): Promise<{ access_token: string }> {
    const payload: UserPayload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateGoogleUser(profile: GoogleProfile): Promise<User> {
    const { email, name, picture } = profile;

    const existingUser = await this.database.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return this.database.user.update({
        where: { email },
        data: {
          firstName: name?.split(' ')[0] || '',
          lastName: name?.split(' ').slice(1).join(' ') || '',
          avatar: picture,
          lastLoginAt: new Date(),
        },
      });
    }

    const user = await this.database.user.create({
      data: {
        email,
        firstName: name?.split(' ')[0] || '',
        lastName: name?.split(' ').slice(1).join(' ') || '',
        avatar: picture,
        lastLoginAt: new Date(),
      },
    });

    await this.database.userProfile.create({
      data: {
        userId: user.id,
      },
    });

    await this.database.userAttribute.createMany({
      data: [
        {
          userId: user.id,
          attribute: 'FITNESS',
          value: 1.0,
        },
        {
          userId: user.id,
          attribute: 'LEADERSHIP',
          value: 1.0,
        },
      ],
    });

    return user;
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string = '',
  ): Promise<UserWithoutPassword> {
    const existingUser = await this.database.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.database.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    await this.database.userProfile.create({
      data: {
        userId: user.id,
      },
    });

    await this.database.userAttribute.createMany({
      data: [
        {
          userId: user.id,
          attribute: 'FITNESS',
          value: 1.0,
        },
        {
          userId: user.id,
          attribute: 'LEADERSHIP',
          value: 1.0,
        },
      ],
    });

    return this.excludePassword(user);
  }
}
