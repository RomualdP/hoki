import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  UserNotFoundException,
  UserProfileNotFoundException,
} from '../common/exceptions/user.exceptions';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateProfileDto,
  QueryUsersDto,
  AddSkillDto,
  UpdateSkillDto,
} from './dto';
import { UserWhereInput, VolleyballSkill } from '../types';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(query: QueryUsersDto) {
    const { page = 1, limit = 10, name, email, city, position } = query;
    const skip = (page - 1) * limit;

    const where: UserWhereInput = {};

    if (name) {
      where.OR = [
        { firstName: { contains: name, mode: 'insensitive' } },
        { lastName: { contains: name, mode: 'insensitive' } },
      ];
    }

    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (city) where.profile = { city: { contains: city, mode: 'insensitive' } };
    if (position)
      where.profile = {
        position: position as
          | 'SETTER'
          | 'OUTSIDE_HITTER'
          | 'MIDDLE_BLOCKER'
          | 'OPPOSITE'
          | 'LIBERO'
          | 'DEFENSIVE_SPECIALIST',
      };

    const [users, total] = await Promise.all([
      this.database.user.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          profile: true,
          _count: {
            select: {
              skills: true,
              teamMemberships: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.database.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    try {
      const user = await this.database.user.findUnique({
        where: { id },
        include: {
          profile: true,
          skills: true,
          teamMemberships: {
            include: { team: true },
          },
        },
      });

      if (!user) {
        throw new UserNotFoundException(id);
      }

      return user;
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        throw error; // Le filtre global gérera les erreurs Prisma
      }
      throw error;
    }
  }

  async getProfile(id: string) {
    const profile = await this.database.userProfile.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      throw new UserProfileNotFoundException(id);
    }

    return profile;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    try {
      const user = await this.database.user.findUnique({ where: { id } });
      if (!user) {
        throw new UserNotFoundException(id);
      }

      return this.database.userProfile.upsert({
        where: { userId: id },
        update: updateProfileDto,
        create: {
          userId: id,
          ...updateProfileDto,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        throw error; // Le filtre global gérera les erreurs Prisma
      }
      throw error;
    }
  }

  async getUserSkills(id: string) {
    return this.database.userSkill.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addSkill(id: string, skillData: AddSkillDto) {
    return this.database.userSkill.upsert({
      where: {
        userId_skill: {
          userId: id,
          skill: skillData.skill,
        },
      },
      update: {
        level: skillData.level,
        experienceYears: skillData.experienceYears,
        notes: skillData.notes,
        updatedAt: new Date(),
      },
      create: {
        userId: id,
        skill: skillData.skill,
        level: skillData.level,
        experienceYears: skillData.experienceYears,
        notes: skillData.notes,
      },
    });
  }

  async updateSkill(userId: string, skill: string, skillData: UpdateSkillDto) {
    return this.database.userSkill.update({
      where: {
        userId_skill: {
          userId,
          skill: skill as VolleyballSkill,
        },
      },
      data: skillData,
    });
  }

  async removeSkill(userId: string, skill: string) {
    return this.database.userSkill.delete({
      where: {
        userId_skill: {
          userId,
          skill: skill as VolleyballSkill,
        },
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    return this.database.user.create({
      data: createUserDto,
      include: {
        profile: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.database.user.findUnique({ where: { id } });
      if (!user) {
        throw new UserNotFoundException(id);
      }

      return this.database.user.update({
        where: { id },
        data: updateUserDto,
        include: {
          profile: true,
        },
      });
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        throw error; // Le filtre global gérera les erreurs Prisma
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const user = await this.database.user.findUnique({ where: { id } });
      if (!user) {
        throw new UserNotFoundException(id);
      }

      return this.database.user.delete({ where: { id } });
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        throw error; // Le filtre global gérera les erreurs Prisma
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.database.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
  }
}
