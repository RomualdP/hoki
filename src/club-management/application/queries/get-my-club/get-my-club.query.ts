/**
 * GetMyClubQuery - CQRS Query
 * Get the current club of a user
 */
export class GetMyClubQuery {
  constructor(public readonly userId: string) {}
}
