import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateTrainingTeamsCommand {
  @IsString()
  @IsNotEmpty()
  trainingId: string;
}
