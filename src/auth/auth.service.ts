import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
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
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user?.password && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserWithoutPassword): Promise<{ access_token: string }> {
    const payload: UserPayload = { email: user.email!, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateGoogleUser(profile: GoogleProfile): Promise<User> {
    const { email, name, picture } = profile;

    return this.prisma.user.upsert({
      where: { email },
      update: {
        name,
        image: picture,
      },
      create: {
        email,
        name,
        image: picture,
        emailVerified: new Date(),
      },
    });
  }

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<UserWithoutPassword> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }
}
