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

export interface IUserRepository {
  /**
   * Trouve plusieurs utilisateurs par leurs IDs avec leurs compétences et attributs
   * @param userIds Liste des IDs des utilisateurs à récupérer
   * @returns Liste des utilisateurs avec leurs détails
   */
  findManyByIdsWithDetails(
    userIds: string[],
  ): Promise<UserWithSkillsAndAttributes[]>;
}
