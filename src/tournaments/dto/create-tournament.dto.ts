export class CreateTournamentDto {
  readonly name: string;
  readonly description?: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly maxTeams: number;
}

export class UpdateTournamentDto {
  readonly name?: string;
  readonly description?: string;
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly maxTeams?: number;
  readonly status?: 'REGISTRATION' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}
