import type { VolleyballSkill, SkillDefinition } from '../types/skill';

export const VOLLEYBALL_SKILLS: VolleyballSkill[] = [
  'ATTACK',
  'DEFENSE',
  'SERVING',
  'RECEPTION',
  'SETTING',
  'BLOCKING',
];

export const VOLLEYBALL_SKILL_DEFINITIONS: Record<VolleyballSkill, SkillDefinition> = {
  ATTACK: {
    skill: 'ATTACK',
    name: 'Attaque',
    description: 'Capacité à réaliser des attaques efficaces et variées',
  },
  DEFENSE: {
    skill: 'DEFENSE',
    name: 'Défense',
    description: 'Aptitude à défendre et récupérer les ballons difficiles',
  },
  SERVING: {
    skill: 'SERVING',
    name: 'Service',
    description: 'Maîtrise technique et tactique du service',
  },
  RECEPTION: {
    skill: 'RECEPTION',
    name: 'Réception',
    description: 'Qualité de la réception de service et des ballons difficiles',
  },
  SETTING: {
    skill: 'SETTING',
    name: 'Passe',
    description: 'Précision et créativité dans la distribution du jeu',
  },
  BLOCKING: {
    skill: 'BLOCKING',
    name: 'Contre',
    description: 'Efficacité au contre, lecture du jeu adverse',
  },
};

export const getSkillDefinition = (skill: VolleyballSkill): SkillDefinition => {
  return VOLLEYBALL_SKILL_DEFINITIONS[skill];
};

export const getAllSkillDefinitions = (): SkillDefinition[] => {
  return VOLLEYBALL_SKILLS.map(skill => VOLLEYBALL_SKILL_DEFINITIONS[skill]);
};
