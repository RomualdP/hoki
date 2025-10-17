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

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.database.user.findUnique({ where: { email } });
    if (user?.password && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
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

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.database.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Mise à jour de l'utilisateur existant
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

    // Création d'un nouvel utilisateur avec profil et attributs
    const user = await this.database.user.create({
      data: {
        email,
        firstName: name?.split(' ')[0] || '',
        lastName: name?.split(' ').slice(1).join(' ') || '',
        avatar: picture,
        lastLoginAt: new Date(),
      },
    });

    // Créer automatiquement un profil vide
    await this.database.userProfile.create({
      data: {
        userId: user.id,
      },
    });

    // Créer automatiquement les attributs FITNESS et LEADERSHIP
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

    // Créer automatiquement un profil vide
    await this.database.userProfile.create({
      data: {
        userId: user.id,
      },
    });

    // Créer automatiquement les attributs FITNESS et LEADERSHIP
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }
}
