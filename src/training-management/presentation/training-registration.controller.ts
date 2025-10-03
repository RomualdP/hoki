import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RegisterToTrainingUseCase } from '../application/use-cases/register-to-training/register-to-training.use-case';
import { CancelRegistrationUseCase } from '../application/use-cases/cancel-registration/cancel-registration.use-case';
import { RegisterToTrainingDto } from '../application/use-cases/register-to-training/register-to-training.dto';
import { CancelRegistrationDto } from '../application/use-cases/cancel-registration/cancel-registration.dto';

@Controller('training-registrations')
@UseGuards(JwtAuthGuard)
export class TrainingRegistrationController {
  constructor(
    private readonly registerToTrainingUseCase: RegisterToTrainingUseCase,
    private readonly cancelRegistrationUseCase: CancelRegistrationUseCase,
  ) {}

  @Post()
  async register(
    @Body() registerDto: RegisterToTrainingDto,
    @Request() req: Express.Request & { user: { userId: string } },
  ) {
    return this.registerToTrainingUseCase.execute({
      ...registerDto,
      userId: req.user.userId,
    });
  }

  @Delete()
  async cancel(
    @Body() cancelDto: CancelRegistrationDto,
    @Request() req: Express.Request & { user: { userId: string } },
  ) {
    return this.cancelRegistrationUseCase.execute({
      ...cancelDto,
      userId: req.user.userId,
    });
  }
}
