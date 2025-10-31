export interface User {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly avatar?: string;
  readonly role: UserRole;
  readonly clubId?: string | null;
  readonly clubRole?: ClubRole | null;
  readonly isActive: boolean;
  readonly lastLoginAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type UserRole = "USER" | "ADMIN";
export type ClubRole = "OWNER" | "COACH" | "PLAYER" | null;

export interface UserCreateData {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly password: string;
  readonly role?: UserRole;
}

export interface UserUpdateData {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatar?: string;
  readonly role?: UserRole;
  readonly isActive?: boolean;
}

export interface PasswordChangeData {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
}

export interface Team {
  readonly id: string;
  readonly name: string;
  readonly logo?: string;
  readonly description?: string;
  readonly foundedYear?: number;
  readonly members: TeamMember[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface TeamMember {
  readonly id: string;
  readonly userId: string;
  readonly teamId: string;
  readonly role: TeamRole;
  readonly user: User;
  readonly joinedAt: Date;
}

export type TeamRole = "CAPTAIN" | "COACH" | "PLAYER" | "SUBSTITUTE";

export interface Match {
  readonly id: string;
  readonly homeTeamId: string;
  readonly awayTeamId: string;
  readonly homeTeam: Team;
  readonly awayTeam: Team;
  readonly scheduledAt: Date;
  readonly location?: string;
  readonly status: MatchStatus;
  readonly homeScore?: number;
  readonly awayScore?: number;
  readonly sets?: Set[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type MatchStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Set {
  readonly id: string;
  readonly matchId: string;
  readonly setNumber: number;
  readonly homeScore: number;
  readonly awayScore: number;
  readonly isCompleted: boolean;
}

export interface Tournament {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly status: TournamentStatus;
  readonly maxTeams: number;
  readonly teams: Team[];
  readonly matches: Match[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type TournamentStatus =
  | "REGISTRATION"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface ApiResponse<T = unknown> {
  readonly data: T;
  readonly message?: string;
  readonly success: boolean;
}

export interface PaginatedResponse<T = unknown> {
  readonly data: T[];
  readonly meta: {
    readonly total: number;
    readonly page: number;
    readonly limit: number;
    readonly totalPages: number;
  };
}

// Export des types spécialisés
export * from "./match";
export * from "./skill";
export * from "./news";
export * from "./profile";
