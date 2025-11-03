import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateTrainingTemplateHandler } from '../application/commands/create-training-template/create-training-template.handler';
import { UpdateTrainingTemplateHandler } from '../application/commands/update-training-template/update-training-template.handler';
import { DeleteTrainingTemplateHandler } from '../application/commands/delete-training-template/delete-training-template.handler';
import { ToggleTrainingTemplateHandler } from '../application/commands/toggle-training-template/toggle-training-template.handler';
import { ListTrainingTemplatesHandler } from '../application/queries/list-training-templates/list-training-templates.handler';
import { GetTrainingTemplateHandler } from '../application/queries/get-training-template/get-training-template.handler';
import { CreateTrainingTemplateCommand } from '../application/commands/create-training-template/create-training-template.command';
import { UpdateTrainingTemplateCommand } from '../application/commands/update-training-template/update-training-template.command';
import { DeleteTrainingTemplateCommand } from '../application/commands/delete-training-template/delete-training-template.command';
import { ToggleTrainingTemplateCommand } from '../application/commands/toggle-training-template/toggle-training-template.command';
import { ListTrainingTemplatesQuery } from '../application/queries/list-training-templates/list-training-templates.query';
import { GetTrainingTemplateQuery } from '../application/queries/get-training-template/get-training-template.query';
import { CreateTrainingTemplateDto } from './dto/create-training-template.dto';
import { UpdateTrainingTemplateDto } from './dto/update-training-template.dto';

@Controller('training-templates')
@UseGuards(JwtAuthGuard)
export class TrainingTemplateController {
  constructor(
    private readonly createTemplateHandler: CreateTrainingTemplateHandler,
    private readonly updateTemplateHandler: UpdateTrainingTemplateHandler,
    private readonly deleteTemplateHandler: DeleteTrainingTemplateHandler,
    private readonly toggleTemplateHandler: ToggleTrainingTemplateHandler,
    private readonly listTemplatesHandler: ListTrainingTemplatesHandler,
    private readonly getTemplateHandler: GetTrainingTemplateHandler,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateTrainingTemplateDto,
    @CurrentUser() user: { id: string; clubId: string },
  ) {
    const command: CreateTrainingTemplateCommand = {
      clubId: user.clubId,
      title: dto.title,
      description: dto.description,
      duration: dto.duration,
      location: dto.location,
      maxParticipants: dto.maxParticipants,
      dayOfWeek: dto.dayOfWeek,
      time: dto.time,
      isActive: dto.isActive,
      teamIds: dto.teamIds,
    };

    const templateId = await this.createTemplateHandler.execute(command);
    return { id: templateId };
  }

  @Get()
  async findAll(
    @Query() query: Omit<ListTrainingTemplatesQuery, 'clubId'>,
    @CurrentUser() user: { id: string; clubId: string },
  ) {
    const fullQuery: ListTrainingTemplatesQuery = {
      ...query,
      clubId: user.clubId,
    };
    return this.listTemplatesHandler.execute(fullQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const query: GetTrainingTemplateQuery = { id };
    return this.getTemplateHandler.execute(query);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTrainingTemplateDto,
  ) {
    const command: UpdateTrainingTemplateCommand = {
      id,
      ...dto,
    };
    await this.updateTemplateHandler.execute(command);
  }

  @Patch(':id/toggle')
  @HttpCode(HttpStatus.NO_CONTENT)
  async toggle(@Param('id') id: string) {
    const command: ToggleTrainingTemplateCommand = { id };
    await this.toggleTemplateHandler.execute(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const command: DeleteTrainingTemplateCommand = { id };
    await this.deleteTemplateHandler.execute(command);
  }
}
