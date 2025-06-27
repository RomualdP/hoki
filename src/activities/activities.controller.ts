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
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  async findAll(@Query() query: any) {
    return await this.activitiesService.findAll(query);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string, @Query() query: any) {
    return await this.activitiesService.findByUser(userId, query);
  }

  @Get('team/:teamId')
  async findByTeam(@Param('teamId') teamId: string, @Query() query: any) {
    return await this.activitiesService.findByTeam(teamId, query);
  }

  @Post()
  async create(@Body() createActivityDto: any) {
    return await this.activitiesService.create(createActivityDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.activitiesService.remove(id);
  }
}
