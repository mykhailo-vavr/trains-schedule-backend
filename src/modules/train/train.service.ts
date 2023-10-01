import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class TrainService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByName(name: string) {
    return this.prismaService.train.findUnique({ where: { name } });
  }

  async getByScheduleId(id: number) {
    return this.prismaService.train.findFirst({
      where: {
        schedules: {
          some: {
            id,
          },
        },
      },
    });
  }

  async isFree(
    name: string,
    departureTime: string | Date,
    arrivalTime: string | Date,
    scheduleId?: number,
  ) {
    const existedTrain = await this.getByName(name);

    if (!existedTrain) {
      return true;
    }

    const freeTrains = await this.prismaService.train.findUnique({
      where: {
        name,
        schedules: {
          some: {
            NOT: { id: scheduleId },
            OR: [
              {
                departureTime: {
                  lte: new Date(arrivalTime),
                },
                arrivalTime: {
                  gte: new Date(arrivalTime),
                },
              },
              {
                departureTime: {
                  lte: new Date(departureTime),
                },
                arrivalTime: {
                  gte: new Date(departureTime),
                },
              },
              {
                departureTime: {
                  gte: new Date(departureTime),
                },
                arrivalTime: {
                  lte: new Date(arrivalTime),
                },
              },
            ],
          },
        },
      },
    });

    return !freeTrains;
  }
}
