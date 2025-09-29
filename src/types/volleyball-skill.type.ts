export type VolleyballSkill =
  | 'ATTACK'
  | 'DEFENSE'
  | 'SERVING'
  | 'RECEPTION'
  | 'SETTING'
  | 'BLOCKING'
  | 'TEAMWORK';

export const VOLLEYBALL_SKILLS: VolleyballSkill[] = [
  'ATTACK',
  'DEFENSE',
  'SERVING',
  'RECEPTION',
  'SETTING',
  'BLOCKING',
  'TEAMWORK',
];

export const VOLLEYBALL_SKILL_LABELS: Record<VolleyballSkill, string> = {
  ATTACK: 'Attaque',
  DEFENSE: 'Défense',
  SERVING: 'Service',
  RECEPTION: 'Réception',
  SETTING: 'Passe',
  BLOCKING: 'Contre',
  TEAMWORK: "Esprit d'équipe",
};

export const VOLLEYBALL_SKILL_DESCRIPTIONS: Record<VolleyballSkill, string> = {
  ATTACK: 'Capacité à réaliser des attaques efficaces et variées',
  DEFENSE: 'Aptitude à défendre et récupérer les ballons difficiles',
  SERVING: 'Maîtrise technique et tactique du service',
  RECEPTION: 'Qualité de la réception de service et des ballons difficiles',
  SETTING: 'Précision et créativité dans la distribution du jeu',
  BLOCKING: 'Efficacité au contre, lecture du jeu adverse',
  TEAMWORK: "Communication, solidarité et esprit d'équipe",
};
