import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterToTrainingCommand {
  @IsString()
  @IsNotEmpty()
  trainingId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
