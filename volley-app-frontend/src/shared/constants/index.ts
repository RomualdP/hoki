export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  TEAMS: '/teams',
  MATCHES: '/matches',
  TOURNAMENTS: '/tournaments',
  PLAYERS: '/players',
  PROFILE: '/profile',
} as const;

export const MATCH_STATUSES = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const TEAM_ROLES = {
  CAPTAIN: 'CAPTAIN',
  COACH: 'COACH',
  PLAYER: 'PLAYER',
  SUBSTITUTE: 'SUBSTITUTE',
} as const;

export const TOURNAMENT_STATUSES = {
  REGISTRATION: 'REGISTRATION',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const VOLLEYBALL_SET_MAX_SCORE = 25;
export const VOLLEYBALL_FINAL_SET_MAX_SCORE = 15;
export const VOLLEYBALL_MIN_SCORE_DIFFERENCE = 2;
export const MAX_SETS_PER_MATCH = 5;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const; 