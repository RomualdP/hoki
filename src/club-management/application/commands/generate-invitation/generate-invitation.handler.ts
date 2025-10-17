import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GenerateInvitationCommand } from './generate-invitation.command';
import { Invitation } from '../../../domain/entities/invitation.entity';
import {
  IInvitationRepository,
  INVITATION_REPOSITORY,
} from '../../../domain/repositories/invitation.repository';
import { randomUUID } from 'crypto';
import { randomBytes } from 'crypto';

@Injectable()
@CommandHandler(GenerateInvitationCommand)
export class GenerateInvitationHandler
  implements ICommandHandler<GenerateInvitationCommand, string>
{
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly invitationRepository: IInvitationRepository,
  ) {}

  async execute(command: GenerateInvitationCommand): Promise<string> {
    // Generate unique token
    const token = this.generateUniqueToken();

    // Create invitation entity
    const invitation = Invitation.create({
      id: randomUUID(),
      token,
      clubId: command.clubId,
      type: command.type,
      createdBy: command.createdBy,
      expiresInDays: command.expiresInDays,
    });

    // Persist invitation
    const savedInvitation = await this.invitationRepository.save(invitation);

    // Return token (will be used to build invitation link)
    return savedInvitation.token;
  }

  private generateUniqueToken(): string {
    return randomBytes(32).toString('hex');
  }
}
