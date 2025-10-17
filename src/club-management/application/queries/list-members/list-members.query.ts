import { ClubRole } from '../../../domain/value-objects/club-role.vo';

export class ListMembersQuery {
  constructor(
    public readonly clubId: string,
    public readonly roleFilter?: ClubRole,
  ) {}
}
