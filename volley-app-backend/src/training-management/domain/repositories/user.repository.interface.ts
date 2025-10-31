export interface UserWithSkillsAndAttributes {
  id: string;
  profile: {
    gender: string | null;
  } | null;
  skills: Array<{
    level: number;
  }>;
  attributes: Array<{
    attribute: string;
    value: number;
  }>;
}

export interface UserWithFullProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  profile: {
    gender: string | null;
  } | null;
  skills: Array<{
    level: number;
  }>;
  attributes: Array<{
    attribute: string;
    value: number;
  }>;
}

export interface UserBasicInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
}

export interface IUserRepository {
  findManyByIdsWithDetails(
    userIds: string[],
  ): Promise<UserWithSkillsAndAttributes[]>;

  findManyByIdsWithFullProfile(
    userIds: string[],
  ): Promise<UserWithFullProfile[]>;

  findManyByIdsBasicInfo(userIds: string[]): Promise<UserBasicInfo[]>;
}
