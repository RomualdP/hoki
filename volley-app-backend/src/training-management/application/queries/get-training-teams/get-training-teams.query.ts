import { IsString, IsNotEmpty } from 'class-validator';

export class GetTrainingTeamsQuery {
  @IsString()
  @IsNotEmpty()
  trainingId: string;
}
