/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GenerateInvitationDto } from './dtos';
import {
  GenerateInvitationCommand,
  AcceptInvitationCommand,
  RemoveMemberCommand,
} from '../application/commands';
import {
  ValidateInvitationQuery,
  ListMembersQuery,
} from '../application/queries';
import { InvitationTypeVO } from '../domain/value-objects/invitation-type.vo';
import { ClubRoleVO } from '../domain/value-objects/club-role.vo';

/**
 * Invitations Controller - Presentation Layer
 * Handles HTTP requests for invitation and member management
 */
@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * POST /invitations/generate
   * Generate a new invitation token
   */
  @Post('generate')
  async generateInvitation(@Body() dto: GenerateInvitationDto) {
    // TODO: Extract clubId and createdBy from JWT token
    const clubId = 'club-id-from-jwt'; // Placeholder
    const createdBy = 'user-id-from-jwt'; // Placeholder

    const invitationType = InvitationTypeVO.fromString(dto.type).value;

    const command = new GenerateInvitationCommand(
      clubId,
      invitationType,
      createdBy,
      dto.expirationDays,
    );

    const invitationId = await this.commandBus.execute(command);

    return {
      success: true,
      data: { invitationId },
      message: 'Invitation generated successfully',
    };
  }

  /**
   * GET /invitations/validate/:token
   * Validate an invitation token
   */
  @Get('validate/:token')
  async validateInvitation(@Param('token') token: string) {
    const query = new ValidateInvitationQuery(token);
    const invitation = await this.queryBus.execute(query);

    return {
      success: true,
      data: invitation,
    };
  }

  /**
   * POST /invitations/accept
   * Accept an invitation
   */
  @Post('accept')
  async acceptInvitation(@Body('token') token: string) {
    // TODO: Extract userId from JWT token
    const userId = 'user-id-from-jwt'; // Placeholder

    const command = new AcceptInvitationCommand(token, userId);
    const memberId = await this.commandBus.execute(command);

    return {
      success: true,
      data: { memberId },
      message: 'Invitation accepted successfully',
    };
  }

  /**
   * GET /invitations/members/:clubId
   * List members of a club
   */
  @Get('members/:clubId')
  async listMembers(
    @Param('clubId') clubId: string,
    @Query('role') role?: string,
  ) {
    const query = new ListMembersQuery(
      clubId,
      role ? ClubRoleVO.fromString(role) : undefined,
    );
    const members = await this.queryBus.execute(query);

    return {
      success: true,
      data: members,
    };
  }

  /**
   * DELETE /invitations/members/:memberId
   * Remove a member from the club
   */
  @Delete('members/:memberId')
  async removeMember(@Param('memberId') memberId: string) {
    // TODO: Extract removerId from JWT token
    const removerId = 'user-id-from-jwt'; // Placeholder

    const command = new RemoveMemberCommand(memberId, removerId);
    await this.commandBus.execute(command);

    return {
      success: true,
      message: 'Member removed successfully',
    };
  }
}
