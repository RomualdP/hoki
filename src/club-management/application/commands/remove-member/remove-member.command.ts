export class RemoveMemberCommand {
  constructor(
    public readonly memberId: string,
    public readonly removerId: string, // Must have permission
  ) {}
}
