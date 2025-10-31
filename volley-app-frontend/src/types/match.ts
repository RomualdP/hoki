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
  readonly maxParticipants?: number;
  readonly participants: MatchParticipant[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type MatchStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Set {
  readonly id: string;
  readonly matchId: string;
  readonly setNumber: number;
  readonly homeScore: number;
  readonly awayScore: number;
  readonly isCompleted: boolean;
}

export interface MatchParticipant {
  readonly id: string;
  readonly matchId: string;
  readonly userId: string;
  readonly user: User;
  readonly teamId?: string;
  readonly team?: Team;
  readonly joinedAt: Date;
}

export interface MatchFilters {
  readonly dateFrom?: Date;
  readonly dateTo?: Date;
  readonly teamId?: string;
  readonly status?: MatchStatus;
  readonly location?: string;
}

export interface MatchCreateData {
  readonly homeTeamId: string;
  readonly awayTeamId: string;
  readonly scheduledAt: Date;
  readonly location?: string;
  readonly maxParticipants?: number;
}

export interface MatchUpdateData {
  readonly scheduledAt?: Date;
  readonly location?: string;
  readonly status?: MatchStatus;
  readonly homeScore?: number;
  readonly awayScore?: number;
  readonly maxParticipants?: number;
}

// Imports des types de base
import type { User, Team } from './index'; 