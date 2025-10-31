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
import { TeamsService } from './teams.service';
import { JwtAuthGuard, ActiveSubscriptionGuard } from '../auth/guards';
import { CurrentUserId } from '../auth/decorators';
import {
  CreateTeamDto,
  QueryTeamsDto,
  UpdateTeamDto,
  AddTeamMemberDto,
} from './dto';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll(
    @Query() query: QueryTeamsDto,
    @CurrentUserId() userId: string,
  ) {
    return this.teamsService.findAll(query, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.teamsService.findOne(id, userId);
  }

  @Post()
  @UseGuards(ActiveSubscriptionGuard)
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @CurrentUserId() userId: string,
  ) {
    return this.teamsService.create(createTeamDto, userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }

  /**
   * Add a member to a team
   * POST /teams/:teamId/members
   */
  @Post(':teamId/members')
  async addMember(
    @Param('teamId') teamId: string,
    @CurrentUserId() userId: string,
    @Body() memberData: AddTeamMemberDto,
  ) {
    return this.teamsService.addMember(teamId, userId, memberData);
  }

  /**
   * Remove a member from a team
   * DELETE /teams/:teamId/members/:memberId
   */
  @Delete(':teamId/members/:memberId')
  async removeMember(
    @Param('teamId') teamId: string,
    @CurrentUserId() userId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.teamsService.removeMember(teamId, userId, memberId);
  }
}
