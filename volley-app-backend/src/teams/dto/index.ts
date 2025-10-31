export class CreateTeamDto {
  readonly name: string;
  readonly description?: string;
  readonly logo?: string;
  readonly isPublic?: boolean;
}

export class UpdateTeamDto {
  readonly name?: string;
  readonly description?: string;
  readonly logo?: string;
  readonly isPublic?: boolean;
}

export class AddTeamMemberDto {
  readonly userId: string;
  readonly role: 'CAPTAIN' | 'COACH' | 'PLAYER' | 'SUBSTITUTE';
  readonly joinedAt?: Date;
}

export class QueryTeamsDto {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
}
