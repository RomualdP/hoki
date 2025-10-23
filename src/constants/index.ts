export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register", // Deprecated - use SIGNUP
  SIGNUP: {
    BASE: "/signup",
    COACH: "/signup/coach",
    PLAYER: "/signup/player",
    ASSISTANT: "/signup/assistant",
    SUCCESS: {
      COACH: "/signup/coach/success",
    },
  },
  DASHBOARD: {
    COACH: "/coach",
    ASSISTANT: "/assistant",
    PLAYER: "/player",
  },
  PROFILE: "/profile",
  MATCHES: "/matches",
  CLUB: "/club",
  TEAMS: "/teams",
  SUBSCRIPTION: "/subscription",
  UPGRADE: "/upgrade",
  ADMIN: {
    BASE: "/admin",
    USERS: "/admin/users",
    NEWS: "/admin/news",
  },
} as const;

export const MATCH_STATUSES = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const TEAM_ROLES = {
  CAPTAIN: "CAPTAIN",
  COACH: "COACH",
  PLAYER: "PLAYER",
  SUBSTITUTE: "SUBSTITUTE",
} as const;

export const TOURNAMENT_STATUSES = {
  REGISTRATION: "REGISTRATION",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
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
