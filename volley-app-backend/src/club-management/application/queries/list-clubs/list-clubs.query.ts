export class ListClubsQuery {
  constructor(
    public readonly skip?: number,
    public readonly take?: number,
    public readonly searchTerm?: string,
  ) {}
}
