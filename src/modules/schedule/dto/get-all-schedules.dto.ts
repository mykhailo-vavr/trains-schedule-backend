import { Prisma } from '@prisma/client';
import { IsEnum, IsIn, IsOptional } from 'class-validator';

export enum SortSchedulesFieldEnum {
  ID = 'id',
  DEPARTURE = 'departure',
  ARRIVAL = 'arrival',
  DEPARTURE_TIME = 'departureTime',
  ARRIVAL_TIME = 'arrivalTime',
}

export class GetAllSchedulesDto {
  @IsOptional()
  @IsEnum(SortSchedulesFieldEnum)
  sort?: SortSchedulesFieldEnum;

  @IsOptional()
  @IsIn(Object.values(Prisma.SortOrder))
  order?: Prisma.SortOrder;

  @IsOptional()
  search?: string;
}
