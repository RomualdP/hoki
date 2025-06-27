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
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateMatchDto,
  UpdateMatchDto,
  QueryMatchesDto,
  CreateMatchEventDto,
  CreateMatchCommentDto,
  CreateMatchParticipantDto,
} from './dto';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async findAll(@Query() query: QueryMatchesDto) {
    return this.matchesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.matchesService.findOne(id);
  }

  @Get(':id/statistics')
  async getStatistics(@Param('id') id: string) {
    return this.matchesService.getStatistics(id);
  }

  @Get(':id/events')
  async getEvents(@Param('id') id: string) {
    return this.matchesService.getEvents(id);
  }

  @Post(':id/events')
  async addEvent(
    @Param('id') id: string,
    @Body() eventData: CreateMatchEventDto,
  ) {
    return this.matchesService.addEvent(id, eventData);
  }

  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    return this.matchesService.getComments(id);
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() commentData: CreateMatchCommentDto,
  ) {
    return this.matchesService.addComment(id, commentData);
  }

  @Post(':id/join')
  async joinMatch(
    @Param('id') id: string,
    @Body() participantData: CreateMatchParticipantDto,
  ) {
    return this.matchesService.joinMatch(id, participantData);
  }

  @Delete(':id/leave')
  async leaveMatch(
    @Param('id') id: string,
    @Body() userData: { userId: string },
  ) {
    return this.matchesService.leaveMatch(id, userData.userId);
  }

  @Post(':id/start')
  async startMatch(@Param('id') id: string) {
    return this.matchesService.startMatch(id);
  }

  @Post(':id/end')
  async endMatch(
    @Param('id') id: string,
    @Body() resultData: Record<string, unknown>,
  ) {
    return this.matchesService.endMatch(id, resultData);
  }

  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.matchesService.remove(id);
  }
}
