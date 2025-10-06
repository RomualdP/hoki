import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateTrainingHandler } from '../application/commands/create-training/create-training.handler';
import { GenerateTrainingTeamsHandler } from '../application/commands/generate-training-teams/generate-training-teams.handler';
import { ListTrainingsHandler } from '../application/queries/list-trainings/list-trainings.handler';
import { GetTrainingHandler } from '../application/queries/get-training/get-training.handler';
import { GetTrainingTeamsHandler } from '../application/queries/get-training-teams/get-training-teams.handler';
import { CreateTrainingCommand } from '../application/commands/create-training/create-training.command';
import { GenerateTrainingTeamsCommand } from '../application/commands/generate-training-teams/generate-training-teams.command';
import { ListTrainingsQuery } from '../application/queries/list-trainings/list-trainings.query';
import { GetTrainingQuery } from '../application/queries/get-training/get-training.query';
import { GetTrainingTeamsQuery } from '../application/queries/get-training-teams/get-training-teams.query';

@Controller('trainings')
@UseGuards(JwtAuthGuard)
export class TrainingController {
  constructor(
    private readonly createTrainingHandler: CreateTrainingHandler,
    private readonly generateTeamsHandler: GenerateTrainingTeamsHandler,
    private readonly listTrainingsHandler: ListTrainingsHandler,
    private readonly getTrainingHandler: GetTrainingHandler,
    private readonly getTeamsHandler: GetTrainingTeamsHandler,
  ) {}

  @Post()
  async create(@Body() command: CreateTrainingCommand) {
    const trainingId = await this.createTrainingHandler.execute(command);
    return { id: trainingId };
  }

  @Get()
  async findAll(@Query() query: ListTrainingsQuery) {
    return this.listTrainingsHandler.execute(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const query: GetTrainingQuery = { id };
    return this.getTrainingHandler.execute(query);
  }

  @Post(':id/generate-teams')
  async generateTeams(@Param('id') trainingId: string) {
    const command: GenerateTrainingTeamsCommand = { trainingId };
    const teamIds = await this.generateTeamsHandler.execute(command);
    return { teamIds };
  }

  @Get(':id/teams')
  async getTeams(@Param('id') trainingId: string) {
    const query: GetTrainingTeamsQuery = { trainingId };
    return this.getTeamsHandler.execute(query);
  }
}
