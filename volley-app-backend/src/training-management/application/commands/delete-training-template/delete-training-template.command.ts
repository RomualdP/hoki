import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteTrainingTemplateCommand {
  @IsString()
  @IsNotEmpty()
  id: string;
}
