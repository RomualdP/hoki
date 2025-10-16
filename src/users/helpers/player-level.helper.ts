import { UserAttribute, UserSkill } from '@prisma/client';
import { getAttributeValue } from './attributes.helper';

export const DEFAULT_FITNESS_COEFFICIENT = 1.0;
export const DEFAULT_LEADERSHIP_COEFFICIENT = 1.0;

/**
 * Calcule le niveau d'un joueur basé sur ses compétences et attributs
 * Formule: Somme(skill.level) × fitness × leadership
 *
 * @param skills - Tableau des compétences du joueur
 * @param attributes - Tableau des attributs du joueur (FITNESS, LEADERSHIP)
 * @returns Niveau calculé du joueur
 */
export function calculatePlayerLevel(
  skills: UserSkill[],
  attributes: UserAttribute[],
): number {
  const skillsSum = skills.reduce((sum, skill) => sum + skill.level, 0);

  const fitnessCoefficient = getAttributeValue(attributes, 'FITNESS');
  const leadershipCoefficient = getAttributeValue(attributes, 'LEADERSHIP');

  const playerLevel = skillsSum * fitnessCoefficient * leadershipCoefficient;

  return playerLevel;
}
