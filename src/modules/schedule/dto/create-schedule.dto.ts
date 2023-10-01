import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { CreateTrainDto } from '../../train';
import { IsDateGreaterThan } from '../../../validators';

export class CreateScheduleDto {
  @IsNotEmpty()
  departure: string;

  @IsNotEmpty()
  arrival: string;

  @IsDateString()
  departureTime: string;

  @IsDateString()
  @IsDateGreaterThan('departureTime')
  arrivalTime: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateTrainDto)
  train: CreateTrainDto;
}
