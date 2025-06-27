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
import { TournamentsService } from './tournaments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tournaments')
@UseGuards(JwtAuthGuard)
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return await this.tournamentsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tournamentsService.findOne(id);
  }

  @Post(':id/teams')
  async addTeam(@Param('id') id: string, @Body() teamData: { teamId: string }) {
    return await this.tournamentsService.addTeam(id, teamData.teamId);
  }

  @Delete(':id/teams/:teamId')
  async removeTeam(@Param('id') id: string, @Param('teamId') teamId: string) {
    return await this.tournamentsService.removeTeam(id, teamId);
  }

  @Post()
  async create(@Body() createTournamentDto: any) {
    return await this.tournamentsService.create(createTournamentDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTournamentDto: any) {
    return await this.tournamentsService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tournamentsService.remove(id);
  }
}
