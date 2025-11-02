import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentClubId } from '../../auth/decorators';
import { CreateTrainingTemplateHandler } from '../application/commands/create-training-template/create-training-template.handler';
import { UpdateTrainingTemplateHandler } from '../application/commands/update-training-template/update-training-template.handler';
import { DeleteTrainingTemplateHandler } from '../application/commands/delete-training-template/delete-training-template.handler';
import { ToggleTrainingTemplateHandler } from '../application/commands/toggle-training-template/toggle-training-template.handler';
import { ListTrainingTemplatesHandler } from '../application/queries/list-training-templates/list-training-templates.handler';
import { CreateTrainingTemplateCommand } from '../application/commands/create-training-template/create-training-template.command';
import { UpdateTrainingTemplateCommand } from '../application/commands/update-training-template/update-training-template.command';
import { DeleteTrainingTemplateCommand } from '../application/commands/delete-training-template/delete-training-template.command';
import { ToggleTrainingTemplateCommand } from '../application/commands/toggle-training-template/toggle-training-template.command';
import { ListTrainingTemplatesQuery } from '../application/queries/list-training-templates/list-training-templates.query';

@Controller('training-templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('training-templates')
export class TrainingTemplateController {
  constructor(
    private readonly createHandler: CreateTrainingTemplateHandler,
    private readonly updateHandler: UpdateTrainingTemplateHandler,
    private readonly deleteHandler: DeleteTrainingTemplateHandler,
    private readonly toggleHandler: ToggleTrainingTemplateHandler,
    private readonly listHandler: ListTrainingTemplatesHandler,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a training template' })
  @ApiResponse({ status: 201, description: 'Training template created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() command: CreateTrainingTemplateCommand,
    @CurrentClubId() clubId: string | null,
  ) {
    if (!clubId) {
      throw new BadRequestException('User must belong to a club');
    }
    const templateId = await this.createHandler.execute(command, clubId);
    return { id: templateId };
  }

  @Get()
  @ApiOperation({ summary: 'List all training templates for the user club' })
  @ApiResponse({ status: 200, description: 'Training templates list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentClubId() clubId: string | null) {
    if (!clubId) {
      throw new BadRequestException('User must belong to a club');
    }
    const query: ListTrainingTemplatesQuery = { clubId };
    return this.listHandler.execute(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a training template' })
  @ApiResponse({ status: 200, description: 'Training template updated' })
  @ApiResponse({ status: 404, description: 'Training template not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body() command: UpdateTrainingTemplateCommand,
    @CurrentClubId() clubId: string | null,
  ) {
    if (!clubId) {
      throw new BadRequestException('User must belong to a club');
    }
    await this.updateHandler.execute(id, command, clubId);
    return { success: true };
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle training template active status' })
  @ApiResponse({ status: 200, description: 'Training template toggled' })
  @ApiResponse({ status: 404, description: 'Training template not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async toggle(
    @Param('id') id: string,
    @CurrentClubId() clubId: string | null,
  ) {
    if (!clubId) {
      throw new BadRequestException('User must belong to a club');
    }
    const command: ToggleTrainingTemplateCommand = { id };
    await this.toggleHandler.execute(command, clubId);
    return { success: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a training template' })
  @ApiResponse({ status: 204, description: 'Training template deleted' })
  @ApiResponse({ status: 404, description: 'Training template not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(
    @Param('id') id: string,
    @CurrentClubId() clubId: string | null,
  ) {
    if (!clubId) {
      throw new BadRequestException('User must belong to a club');
    }
    const command: DeleteTrainingTemplateCommand = { id };
    await this.deleteHandler.execute(command, clubId);
  }
}

