export class CreateNotificationDto {
  readonly userId: string;
  readonly type:
    | 'MATCH_REMINDER'
    | 'TEAM_INVITATION'
    | 'NEWS_PUBLISHED'
    | 'ACHIEVEMENT_UNLOCKED'
    | 'COMMENT_REPLY';
  readonly title: string;
  readonly message: string;
  readonly actionUrl?: string;
  readonly metadata?: Record<string, any>;
}
