import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateTrainingUseCase } from '../application/use-cases/create-training/create-training.use-case';
import { ListTrainingsUseCase } from '../application/use-cases/list-trainings/list-trainings.use-case';
import { CreateTrainingDto } from '../application/use-cases/create-training/create-training.dto';
import { ListTrainingsDto } from '../application/use-cases/list-trainings/list-trainings.dto';

@Controller('trainings')
@UseGuards(JwtAuthGuard)
export class TrainingController {
  constructor(
    private readonly createTrainingUseCase: CreateTrainingUseCase,
    private readonly listTrainingsUseCase: ListTrainingsUseCase,
  ) {}

  @Post()
  async create(@Body() createTrainingDto: CreateTrainingDto) {
    return this.createTrainingUseCase.execute(createTrainingDto);
  }

  @Get()
  async findAll(@Query() query: ListTrainingsDto) {
    return this.listTrainingsUseCase.execute(query);
  }
}
