import { IsString, IsNotEmpty } from 'class-validator';

export class CancelRegistrationCommand {
  @IsString()
  @IsNotEmpty()
  trainingId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
