/**
 * CreateClubCommand - CQRS Command
 *
 * Represents the intent to create a new club.
 * This is a simple DTO that carries data from the presentation layer
 * to the application layer.
 */

export class CreateClubCommand {
  constructor(
    public readonly name: string,
    public readonly description: string | null,
    public readonly logo: string | null,
    public readonly location: string | null,
    public readonly ownerId: string, // The COACH who creates the club
  ) {}
}
