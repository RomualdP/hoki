import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
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
import {
  InvitationDetailReadModel,
  MemberListReadModel,
} from '../application/read-models';
import { InvitationTypeVO } from '../domain/value-objects/invitation-type.vo';
import { ClubRoleVO } from '../domain/value-objects/club-role.vo';
import { JwtAuthGuard } from '../../auth/guards';
import { CurrentUserId } from '../../auth/decorators';

/**
 * Invitations Controller - Presentation Layer
 * Handles HTTP requests for invitation and member management
 */
@ApiTags('invitations')
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Générer une invitation',
    description:
      "Crée un lien d'invitation unique pour rejoindre un club avec un rôle spécifique (COACH, PLAYER, ASSISTANT).",
  })
  @ApiResponse({
    status: 201,
    description: 'Invitation générée avec succès',
    schema: {
      example: {
        success: true,
        data: { invitationId: 'inv-uuid-123' },
        message: 'Invitation generated successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié - Token JWT manquant ou invalide',
  })
  @ApiResponse({
    status: 403,
    description: 'Non autorisé - Seuls les admins du club peuvent inviter',
  })
  async generateInvitation(
    @Body() dto: GenerateInvitationDto,
    @CurrentUserId() createdBy: string,
  ) {
    const invitationType = InvitationTypeVO.fromString(dto.type).value;

    const command = new GenerateInvitationCommand(
      dto.clubId,
      invitationType,
      createdBy,
      dto.expirationDays,
    );

    const invitationId: string = await this.commandBus.execute(command);

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
  @ApiOperation({
    summary: "Valider un token d'invitation",
    description:
      "Vérifie qu'un token d'invitation est valide (non expiré, non utilisé). Retourne les détails de l'invitation.",
  })
  @ApiParam({
    name: 'token',
    description: "Token unique de l'invitation",
    example: 'inv-token-abc123def456',
  })
  @ApiResponse({
    status: 200,
    description: "Token valide - Détails de l'invitation",
  })
  @ApiResponse({
    status: 404,
    description: 'Token invalide ou non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Token expiré ou déjà utilisé',
  })
  async validateInvitation(@Param('token') token: string) {
    const query = new ValidateInvitationQuery(token);
    const invitation: InvitationDetailReadModel =
      await this.queryBus.execute(query);

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Accepter une invitation',
    description:
      "Permet à un utilisateur authentifié de rejoindre un club via un lien d'invitation.",
  })
  @ApiResponse({
    status: 201,
    description: 'Invitation acceptée - Utilisateur ajouté au club',
    schema: {
      example: {
        success: true,
        data: { memberId: 'member-uuid-123' },
        message: 'Invitation accepted successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié - Token JWT manquant ou invalide',
  })
  @ApiResponse({
    status: 400,
    description: "Token d'invitation invalide, expiré ou déjà utilisé",
  })
  async acceptInvitation(
    @Body('token') token: string,
    @CurrentUserId() userId: string,
  ) {
    const command = new AcceptInvitationCommand(token, userId);
    const memberId: string = await this.commandBus.execute(command);

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
  @ApiOperation({
    summary: "Lister les membres d'un club",
    description:
      "Récupère la liste des membres d'un club avec filtrage optionnel par rôle (COACH, PLAYER, ASSISTANT).",
  })
  @ApiParam({
    name: 'clubId',
    description: 'ID unique du club',
    example: 'club-uuid-123',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filtrer par rôle (COACH, PLAYER, ASSISTANT)',
    example: 'PLAYER',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des membres récupérée avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Club non trouvé',
  })
  async listMembers(
    @Param('clubId') clubId: string,
    @Query('role') role?: string,
  ) {
    const query = new ListMembersQuery(
      clubId,
      role ? ClubRoleVO.fromString(role) : undefined,
    );
    const members: MemberListReadModel[] = await this.queryBus.execute(query);

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Retirer un membre du club',
    description:
      'Permet aux admins du club de retirer un membre. Un membre peut également se retirer lui-même.',
  })
  @ApiParam({
    name: 'memberId',
    description: 'ID unique du membre à retirer',
    example: 'member-uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Membre retiré avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié - Token JWT manquant ou invalide',
  })
  @ApiResponse({
    status: 403,
    description: 'Non autorisé - Permissions insuffisantes',
  })
  @ApiResponse({
    status: 404,
    description: 'Membre non trouvé',
  })
  async removeMember(
    @Param('memberId') memberId: string,
    @CurrentUserId() removerId: string,
  ) {
    const command = new RemoveMemberCommand(memberId, removerId);
    await this.commandBus.execute(command);

    return {
      success: true,
      message: 'Member removed successfully',
    };
  }
}
