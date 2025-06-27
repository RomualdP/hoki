export class CreateMatchDto {
  readonly homeTeamId: string;
  readonly awayTeamId: string;
  readonly scheduledAt: Date;
  readonly courtId?: string;
  readonly description?: string;
}

export class UpdateMatchDto {
  readonly homeTeamId?: string;
  readonly awayTeamId?: string;
  readonly scheduledAt?: Date;
  readonly courtId?: string;
  readonly description?: string;
  readonly status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  readonly homeScore?: number;
  readonly awayScore?: number;
}

export class QueryMatchesDto {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  teamId?: string;
  page?: number;
  limit?: number;
}

export class CreateMatchEventDto {
  readonly type:
    | 'POINT_SCORED'
    | 'ACE'
    | 'BLOCK'
    | 'ERROR'
    | 'SUBSTITUTION'
    | 'TIMEOUT'
    | 'SET_WON';
  readonly description: string;
  readonly userId?: string;
  readonly setNumber?: number;
}

export class CreateMatchCommentDto {
  readonly content: string;
  readonly authorId: string;
}

export class CreateMatchParticipantDto {
  readonly userId: string;
  readonly teamId?: string;
  readonly confirmed?: boolean;
}
