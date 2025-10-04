import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RegisterToTrainingHandler } from '../application/commands/register-to-training/register-to-training.handler';
import { CancelRegistrationHandler } from '../application/commands/cancel-registration/cancel-registration.handler';
import { RegisterToTrainingCommand } from '../application/commands/register-to-training/register-to-training.command';
import { CancelRegistrationCommand } from '../application/commands/cancel-registration/cancel-registration.command';

@Controller('training-registrations')
@UseGuards(JwtAuthGuard)
export class TrainingRegistrationController {
  constructor(
    private readonly registerToTrainingHandler: RegisterToTrainingHandler,
    private readonly cancelRegistrationHandler: CancelRegistrationHandler,
  ) {}

  @Post()
  async register(
    @Body() command: RegisterToTrainingCommand,
    @Request() req: Express.Request & { user: { userId: string } },
  ) {
    const registrationId = await this.registerToTrainingHandler.execute({
      ...command,
      userId: req.user.userId,
    });
    return { id: registrationId };
  }

  @Delete()
  async cancel(
    @Body() command: CancelRegistrationCommand,
    @Request() req: Express.Request & { user: { userId: string } },
  ) {
    await this.cancelRegistrationHandler.execute({
      ...command,
      userId: req.user.userId,
    });
    return { success: true };
  }
}
