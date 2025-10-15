import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import {
  IUserRepository,
  UserWithSkillsAndAttributes,
  UserWithFullProfile,
  UserBasicInfo,
} from '../../../domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly database: DatabaseService) {}

  async findManyByIdsWithDetails(
    userIds: string[],
  ): Promise<UserWithSkillsAndAttributes[]> {
    const users = await this.database.user.findMany({
      where: { id: { in: userIds } },
      include: {
        profile: true,
        skills: true,
        attributes: true,
      },
    });

    return users.map((user) => ({
      id: user.id,
      profile: user.profile
        ? {
            gender: user.profile.gender,
          }
        : null,
      skills: user.skills.map((skill) => ({
        level: skill.level,
      })),
      attributes: user.attributes.map((attr) => ({
        attribute: attr.attribute,
        value: attr.value,
      })),
    }));
  }

  async findManyByIdsWithFullProfile(
    userIds: string[],
  ): Promise<UserWithFullProfile[]> {
    const users = await this.database.user.findMany({
      where: { id: { in: userIds } },
      include: {
        profile: true,
        skills: true,
        attributes: true,
      },
    });

    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      profile: user.profile
        ? {
            gender: user.profile.gender,
          }
        : null,
      skills: user.skills.map((skill) => ({
        level: skill.level,
      })),
      attributes: user.attributes.map((attr) => ({
        attribute: attr.attribute,
        value: attr.value,
      })),
    }));
  }

  async findManyByIdsBasicInfo(userIds: string[]): Promise<UserBasicInfo[]> {
    const users = await this.database.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
      },
    });

    return users;
  }
}
