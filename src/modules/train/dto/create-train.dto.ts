import { IsNotEmpty } from 'class-validator';

export class CreateTrainDto {
  @IsNotEmpty()
  name: string;
}
