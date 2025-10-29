import {
  Controller,
  Get,
  Post,
  Put,
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
import { CreateClubDto, UpdateClubDto } from './dtos';
import {
  CreateClubCommand,
  UpdateClubCommand,
  DeleteClubCommand,
} from '../application/commands';
import {
  GetClubQuery,
  GetMyClubQuery,
  ListClubsQuery,
} from '../application/queries';
import {
  ClubDetailReadModel,
  ClubListReadModel,
} from '../application/read-models';
import { JwtAuthGuard } from '../../auth/guards';
import { CurrentUserId } from '../../auth/decorators';

/**
 * Clubs Controller - Presentation Layer
 * Handles HTTP requests for club management
 * Delegates to CQRS Command and Query handlers
 */
@ApiTags('clubs')
@Controller('clubs')
export class ClubsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * POST /clubs
   * Create a new club
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Créer un nouveau club',
    description:
      "Permet à un utilisateur authentifié de créer un nouveau club. L'utilisateur devient automatiquement le propriétaire (owner) du club.",
  })
  @ApiResponse({
    status: 201,
    description: 'Club créé avec succès',
    schema: {
      example: {
        success: true,
        data: { clubId: 'club-uuid-123' },
        message: 'Club created successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié - Token JWT manquant ou invalide',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides - Validation échouée',
  })
  async createClub(
    @Body() dto: CreateClubDto,
    @CurrentUserId() ownerId: string,
  ) {
    const command = new CreateClubCommand(
      dto.name,
      dto.description ?? null,
      dto.logo ?? null,
      dto.location ?? null,
      ownerId,
    );

    const clubId: string = await this.commandBus.execute(command);

    return {
      success: true,
      data: { clubId },
      message: 'Club created successfully',
    };
  }

  /**
   * GET /clubs/me
   * Get the current user's active club
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Obtenir le club actif de l'utilisateur actuel",
    description:
      "Récupère les informations détaillées du club auquel l'utilisateur connecté appartient actuellement.",
  })
  @ApiResponse({
    status: 200,
    description: 'Club actif récupéré avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié - Token JWT manquant ou invalide',
  })
  @ApiResponse({
    status: 404,
    description: "L'utilisateur n'a pas de club actif",
  })
  async getMyClub(@CurrentUserId() userId: string) {
    const query = new GetMyClubQuery(userId);
    const club: ClubDetailReadModel = await this.queryBus.execute(query);

    return {
      success: true,
      data: club,
    };
  }

  /**
   * GET /clubs/:id
   * Get club details by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: "Obtenir les détails d'un club",
    description:
      "Récupère les informations détaillées d'un club spécifique avec ses statistiques (nombre de membres, équipes, abonnement).",
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique du club',
    example: 'club-uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Détails du club récupérés avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Club non trouvé',
  })
  async getClub(@Param('id') id: string) {
    const query = new GetClubQuery(id);
    const club: ClubDetailReadModel = await this.queryBus.execute(query);

    return {
      success: true,
      data: club,
    };
  }

  /**
   * GET /clubs
   * List all clubs with optional filters
   */
  @Get()
  @ApiOperation({
    summary: 'Lister tous les clubs',
    description:
      'Récupère la liste de tous les clubs avec pagination et recherche optionnelles. Inclut les statistiques de base (membres, équipes, abonnement).',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Nombre de résultats à sauter (pour pagination)',
    example: 0,
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Nombre de résultats à retourner (pour pagination)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Terme de recherche (nom, description, localisation)',
    example: 'Paris',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des clubs récupérée avec succès',
  })
  async listClubs(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') searchTerm?: string,
  ) {
    const query = new ListClubsQuery(
      skip ? parseInt(skip, 10) : undefined,
      take ? parseInt(take, 10) : undefined,
      searchTerm,
    );
    const clubs: ClubListReadModel[] = await this.queryBus.execute(query);

    return {
      success: true,
      data: clubs,
      meta: {
        skip,
        take,
        count: clubs.length,
      },
    };
  }

  /**
   * PUT /clubs/:id
   * Update club details
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Mettre à jour un club',
    description:
      "Permet de modifier les informations d'un club existant (nom, description, logo, localisation).",
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique du club à modifier',
    example: 'club-uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Club mis à jour avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Club non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides - Validation échouée',
  })
  async updateClub(@Param('id') id: string, @Body() dto: UpdateClubDto) {
    const command = new UpdateClubCommand(
      id,
      dto.name,
      dto.description,
      dto.logo,
      dto.location,
    );

    await this.commandBus.execute(command);

    return {
      success: true,
      message: 'Club updated successfully',
    };
  }

  /**
   * DELETE /clubs/:id
   * Delete a club
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Supprimer un club',
    description:
      "Permet au propriétaire d'un club de le supprimer définitivement. Cette action est irréversible.",
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique du club à supprimer',
    example: 'club-uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Club supprimé avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié - Token JWT manquant ou invalide',
  })
  @ApiResponse({
    status: 403,
    description:
      'Non autorisé - Seul le propriétaire du club peut le supprimer',
  })
  @ApiResponse({
    status: 404,
    description: 'Club non trouvé',
  })
  async deleteClub(
    @Param('id') id: string,
    @CurrentUserId() requesterId: string,
  ) {
    const command = new DeleteClubCommand(id, requesterId);
    await this.commandBus.execute(command);

    return {
      success: true,
      message: 'Club deleted successfully',
    };
  }
}
