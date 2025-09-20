export const SKILL_RATING_OPTIONS = [
  { value: '1', label: '1 - Débutant' },
  { value: '2', label: '2 - Novice' },
  { value: '3', label: '3 - Apprenti' },
  { value: '4', label: '4 - Intermédiaire-' },
  { value: '5', label: '5 - Intermédiaire' },
  { value: '6', label: '6 - Intermédiaire+' },
  { value: '7', label: '7 - Avancé-' },
  { value: '8', label: '8 - Avancé' },
  { value: '9', label: '9 - Expert' },
  { value: '10', label: '10 - Maître' },
];

export const SKILL_LEVEL_OPTIONS = [
  { value: '0', label: '0 - Non évalué' },
  ...SKILL_RATING_OPTIONS,
];