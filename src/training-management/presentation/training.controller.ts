import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateTrainingHandler } from '../application/commands/create-training/create-training.handler';
import { GenerateTrainingTeamsHandler } from '../application/commands/generate-training-teams/generate-training-teams.handler';
import { DeleteTrainingHandler } from '../application/commands/delete-training/delete-training.handler';
import { ListTrainingsHandler } from '../application/queries/list-trainings/list-trainings.handler';
import { GetTrainingHandler } from '../application/queries/get-training/get-training.handler';
import { GetTrainingTeamsHandler } from '../application/queries/get-training-teams/get-training-teams.handler';
import { GetTrainingRegistrationsHandler } from '../application/queries/get-training-registrations/get-training-registrations.handler';
import { RegisterToTrainingHandler } from '../application/commands/register-to-training/register-to-training.handler';
import { CreateTrainingCommand } from '../application/commands/create-training/create-training.command';
import { GenerateTrainingTeamsCommand } from '../application/commands/generate-training-teams/generate-training-teams.command';
import { DeleteTrainingCommand } from '../application/commands/delete-training/delete-training.command';
import { RegisterToTrainingCommand } from '../application/commands/register-to-training/register-to-training.command';
import { ListTrainingsQuery } from '../application/queries/list-trainings/list-trainings.query';
import { GetTrainingQuery } from '../application/queries/get-training/get-training.query';
import { GetTrainingTeamsQuery } from '../application/queries/get-training-teams/get-training-teams.query';
import { GetTrainingRegistrationsQuery } from '../application/queries/get-training-registrations/get-training-registrations.query';
import { RegisterUserToTrainingDto } from './dto/register-user-to-training.dto';

@Controller('trainings')
@UseGuards(JwtAuthGuard)
export class TrainingController {
  constructor(
    private readonly createTrainingHandler: CreateTrainingHandler,
    private readonly generateTeamsHandler: GenerateTrainingTeamsHandler,
    private readonly deleteTrainingHandler: DeleteTrainingHandler,
    private readonly registerToTrainingHandler: RegisterToTrainingHandler,
    private readonly listTrainingsHandler: ListTrainingsHandler,
    private readonly getTrainingHandler: GetTrainingHandler,
    private readonly getTeamsHandler: GetTrainingTeamsHandler,
    private readonly getRegistrationsHandler: GetTrainingRegistrationsHandler,
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

  @Get(':id/registrations')
  async getRegistrations(
    @Param('id') trainingId: string,
    @Query('status') status?: string,
  ) {
    const query: GetTrainingRegistrationsQuery = { trainingId, status };
    return this.getRegistrationsHandler.execute(query);
  }

  @Post(':id/registrations')
  async registerUser(
    @Param('id') trainingId: string,
    @Body() dto: RegisterUserToTrainingDto,
  ) {
    const command: RegisterToTrainingCommand = {
      trainingId,
      userId: dto.userId,
    };
    const registrationId =
      await this.registerToTrainingHandler.execute(command);
    return { id: registrationId };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const command: DeleteTrainingCommand = { id };
    await this.deleteTrainingHandler.execute(command);
  }
}
