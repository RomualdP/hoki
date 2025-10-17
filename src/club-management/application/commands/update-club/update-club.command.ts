/**
 * UpdateClubCommand - CQRS Command
 */

export class UpdateClubCommand {
  constructor(
    public readonly clubId: string,
    public readonly name?: string,
    public readonly description?: string | null,
    public readonly logo?: string | null,
    public readonly location?: string | null,
  ) {}
}
