/**
 * DeleteClubCommand - CQRS Command
 */

export class DeleteClubCommand {
  constructor(
    public readonly clubId: string,
    public readonly requesterId: string, // Must be the owner
  ) {}
}
