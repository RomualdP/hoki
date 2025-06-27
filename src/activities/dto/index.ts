export class CreateActivityDto {
  readonly type:
    | 'USER_ACTION'
    | 'MATCH_EVENT'
    | 'TEAM_EVENT'
    | 'NEWS_EVENT'
    | 'SYSTEM_EVENT';
  readonly actorId: string;
  readonly targetType:
    | 'USER'
    | 'TEAM'
    | 'MATCH'
    | 'NEWS'
    | 'SKILL'
    | 'TOURNAMENT';
  readonly targetId: string;
  readonly action:
    | 'CREATED'
    | 'UPDATED'
    | 'DELETED'
    | 'JOINED'
    | 'LEFT'
    | 'COMPLETED'
    | 'LIKED'
    | 'COMMENTED'
    | 'ACHIEVED';
  readonly metadata?: Record<string, unknown>;
  readonly isPublic?: boolean;
}

export class QueryActivitiesDto {
  userId?: string;
  teamId?: string;
  type?: string;
  targetType?: string;
  isPublic?: string;
  page?: number;
  limit?: number;
}
