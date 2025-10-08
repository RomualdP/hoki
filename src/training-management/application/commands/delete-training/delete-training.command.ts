import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteTrainingCommand {
  @IsString()
  @IsNotEmpty()
  id: string;
}
