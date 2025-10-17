/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateClubDto, UpdateClubDto } from './dtos';
import {
  CreateClubCommand,
  UpdateClubCommand,
  DeleteClubCommand,
} from '../application/commands';
import { GetClubQuery, ListClubsQuery } from '../application/queries';

/**
 * Clubs Controller - Presentation Layer
 * Handles HTTP requests for club management
 * Delegates to CQRS Command and Query handlers
 */
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
  async createClub(@Body() dto: CreateClubDto) {
    // TODO: Extract ownerId from JWT token via @CurrentUser() decorator
    const ownerId = 'user-id-from-jwt'; // Placeholder

    const command = new CreateClubCommand(
      dto.name,
      ownerId,
      dto.description,
      dto.logo,
      dto.location,
    );

    const clubId = await this.commandBus.execute(command);

    return {
      success: true,
      data: { clubId },
      message: 'Club created successfully',
    };
  }

  /**
   * GET /clubs/:id
   * Get club details by ID
   */
  @Get(':id')
  async getClub(@Param('id') id: string) {
    const query = new GetClubQuery(id);
    const club = await this.queryBus.execute(query);

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
  async listClubs(
    @Query('ownerId') ownerId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const query = new ListClubsQuery(ownerId, limit, offset);
    const clubs = await this.queryBus.execute(query);

    return {
      success: true,
      data: clubs,
      meta: {
        limit,
        offset,
        count: clubs.length,
      },
    };
  }

  /**
   * PUT /clubs/:id
   * Update club details
   */
  @Put(':id')
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
  async deleteClub(@Param('id') id: string) {
    const command = new DeleteClubCommand(id);
    await this.commandBus.execute(command);

    return {
      success: true,
      message: 'Club deleted successfully',
    };
  }
}
