export class CreateNewsDto {
  readonly title: string;
  readonly content: string;
  readonly authorId: string;
  readonly category?:
    | 'MATCH_RESULTS'
    | 'TOURNAMENT'
    | 'TEAM_NEWS'
    | 'PLAYER_SPOTLIGHT'
    | 'GENERAL'
    | 'ANNOUNCEMENT';
  readonly featuredImage?: string;
  readonly isPublished?: boolean;
}

export class UpdateNewsDto {
  readonly title?: string;
  readonly content?: string;
  readonly category?:
    | 'MATCH_RESULTS'
    | 'TOURNAMENT'
    | 'TEAM_NEWS'
    | 'PLAYER_SPOTLIGHT'
    | 'GENERAL'
    | 'ANNOUNCEMENT';
  readonly featuredImage?: string;
  readonly isPublished?: boolean;
}

export class QueryNewsDto {
  category?: string;
  authorId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export class CreateNewsCommentDto {
  readonly content: string;
  readonly authorId: string;
  readonly parentId?: string;
}

export class UpdateNewsCommentDto {
  readonly content?: string;
}

export class CreateNewsInteractionDto {
  readonly type: 'LIKE' | 'VIEW' | 'SHARE';
  readonly userId: string;
}
