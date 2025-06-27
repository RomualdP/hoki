import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
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
      throw new NotFoundException(`Profile for user ${id} not found`);
    }

    return profile;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
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
    return this.prisma.userSkill.create({
      data: {
        userId: id,
        ...skillData,
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
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        profile: true,
        statistics: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.delete({ where: { id } });
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
