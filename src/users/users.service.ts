import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
import { UserWhereInput } from '../types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
      this.prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          profile: true,
          statistics: true,
          _count: {
            select: {
              skills: true,
              achievements: true,
              teamMemberships: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
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
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
          statistics: true,
          skills: {
            include: { skill: true },
          },
          achievements: true,
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
    const profile = await this.prisma.userProfile.findUnique({
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
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new UserNotFoundException(id);
      }

      return this.prisma.userProfile.upsert({
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

  async getStatistics(id: string) {
    const statistics = await this.prisma.userStatistics.findUnique({
      where: { userId: id },
    });

    if (!statistics) {
      return this.prisma.userStatistics.create({
        data: { userId: id },
      });
    }

    return statistics;
  }

  async getAchievements(id: string) {
    return this.prisma.achievement.findMany({
      where: { userId: id },
      orderBy: { earnedAt: 'desc' },
    });
  }

  async getUserSkills(id: string) {
    return this.prisma.userSkill.findMany({
      where: { userId: id },
      include: { skill: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addSkill(id: string, skillData: AddSkillDto) {
    return this.prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: id,
          skillId: skillData.skillId,
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
        skillId: skillData.skillId,
        level: skillData.level,
        experienceYears: skillData.experienceYears,
        notes: skillData.notes,
      },
      include: { skill: true },
    });
  }

  async updateSkill(
    userId: string,
    skillId: string,
    skillData: UpdateSkillDto,
  ) {
    return this.prisma.userSkill.update({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
      data: skillData,
      include: { skill: true },
    });
  }

  async removeSkill(userId: string, skillId: string) {
    return this.prisma.userSkill.delete({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      include: {
        profile: true,
        statistics: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new UserNotFoundException(id);
      }

      return this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        include: {
          profile: true,
          statistics: true,
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
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new UserNotFoundException(id);
      }

      return this.prisma.user.delete({ where: { id } });
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
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        statistics: true,
      },
    });
  }
}
