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
import { ListTrainingsHandler } from '../application/queries/list-trainings/list-trainings.handler';
import { GetTrainingHandler } from '../application/queries/get-training/get-training.handler';
import { CreateTrainingCommand } from '../application/commands/create-training/create-training.command';
import { ListTrainingsQuery } from '../application/queries/list-trainings/list-trainings.query';
import { GetTrainingQuery } from '../application/queries/get-training/get-training.query';

@Controller('trainings')
@UseGuards(JwtAuthGuard)
export class TrainingController {
  constructor(
    private readonly createTrainingHandler: CreateTrainingHandler,
    private readonly listTrainingsHandler: ListTrainingsHandler,
    private readonly getTrainingHandler: GetTrainingHandler,
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
}
