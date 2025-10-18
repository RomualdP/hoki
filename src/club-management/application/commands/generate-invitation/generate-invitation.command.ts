import { InvitationType } from '../../../domain/value-objects/invitation-type.vo';

export class GenerateInvitationCommand {
  constructor(
    public readonly clubId: string,
    public readonly type: InvitationType,
    public readonly createdBy: string,
    public readonly expiresInDays?: number,
  ) {}
}
