import { InvitationType } from '../../../domain/entities/invitation.entity';

export class GenerateInvitationCommand {
  constructor(
    public readonly clubId: string,
    public readonly type: InvitationType,
    public readonly createdBy: string,
    public readonly expiresInDays?: number,
  ) {}
}
