export class ChangeClubCommand {
  constructor(
    public readonly userId: string,
    public readonly newClubId: string,
  ) {}
}
