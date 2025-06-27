export class CreateSkillDto {
  readonly name: string;
  readonly description?: string;
  readonly category:
    | 'ATTACK'
    | 'DEFENSE'
    | 'SERVING'
    | 'RECEPTION'
    | 'SETTING'
    | 'BLOCKING'
    | 'TEAMWORK'
    | 'LEADERSHIP';
  readonly level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  readonly isActive?: boolean;
}

export class UpdateSkillDto {
  readonly name?: string;
  readonly description?: string;
  readonly category?:
    | 'ATTACK'
    | 'DEFENSE'
    | 'SERVING'
    | 'RECEPTION'
    | 'SETTING'
    | 'BLOCKING'
    | 'TEAMWORK'
    | 'LEADERSHIP';
  readonly level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  readonly isActive?: boolean;
}

export class QuerySkillsDto {
  readonly page?: number;
  readonly limit?: number;
  readonly category?:
    | 'ATTACK'
    | 'DEFENSE'
    | 'SERVING'
    | 'RECEPTION'
    | 'SETTING'
    | 'BLOCKING'
    | 'TEAMWORK'
    | 'LEADERSHIP';
  readonly level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  readonly isActive?: string;
}
