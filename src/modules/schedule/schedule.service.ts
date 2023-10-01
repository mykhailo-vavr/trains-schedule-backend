import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateScheduleDto,
  GetAllSchedulesDto,
  SortSchedulesFieldEnum,
  UpdateScheduleDto,
} from './dto';
import { PrismaService } from '../prisma';
import { TrainService } from '../train';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly trainService: TrainService,
  ) {}

  async create(data: CreateScheduleDto) {
    const existedSchedule = await this.getIdentical(data);

    if (existedSchedule) {
      throw new ConflictException(
        'There is already existing schedule with such params',
      );
    }

    const { train, departure, arrival, departureTime, arrivalTime } = data;

    const isFree = await this.trainService.isFree(
      train.name,
      departureTime,
      arrivalTime,
    );

    if (!isFree) {
      throw new ConflictException('This train is already occupied');
    }

    const schedule = await this.prismaService.schedule.create({
      data: {
        departure,
        arrival,
        departureTime,
        arrivalTime,
        train: {
          connectOrCreate: {
            where: { name: train.name },
            create: { name: train.name },
          },
        },
      },
    });

    return schedule;
  }

  async getAll(query: GetAllSchedulesDto) {
    const {
      search,
      sort = SortSchedulesFieldEnum.ID,
      order = Prisma.SortOrder.asc,
    } = query;

    return this.prismaService.schedule.findMany({
      where: {
        OR: [
          { departure: { contains: search, mode: 'insensitive' } },
          { arrival: { contains: search, mode: 'insensitive' } },
          { train: { name: { contains: search, mode: 'insensitive' } } },
        ],
      },
      include: {
        train: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { [sort]: order },
    });
  }

  async getByPk(id: number) {
    const schedule = await this.prismaService.schedule.findUnique({
      where: { id },
      include: {
        train: {
          select: { id: true, name: true },
        },
      },
    });

    if (!schedule) {
      throw new NotFoundException('There is no schedule with such id');
    }

    return schedule;
  }

  async update(id: number, data: UpdateScheduleDto) {
    const existedSchedule = await this.getByPk(id);

    const departureTime = data.departureTime || existedSchedule.departureTime;
    const arrivalTime = data.arrivalTime || existedSchedule.arrivalTime;

    if (departureTime >= arrivalTime) {
      throw new BadRequestException(
        'arrivalTime must be greater than departureTime',
      );
    }

    const { train, departure, arrival } = data;

    if (train?.name || data.departureTime || data.arrivalTime) {
      const trainName =
        train?.name || (await this.trainService.getByScheduleId(id))?.name;

      if (!trainName) {
        throw new NotFoundException('There is no train schedule');
      }

      const isFree = await this.trainService.isFree(
        trainName,
        departureTime,
        arrivalTime,
        id,
      );

      if (!isFree) {
        throw new ConflictException('This train is already occupied');
      }
    }

    const updatedSchedule = await this.prismaService.schedule.update({
      where: { id },
      data: {
        departure,
        arrival,
        departureTime,
        arrivalTime,
        ...(train && {
          train: {
            connectOrCreate: {
              where: { name: train.name },
              create: { name: train.name },
            },
          },
        }),
      },
    });

    return updatedSchedule;
  }

  async delete(id: number) {
    await this.getByPk(id);

    return this.prismaService.schedule.delete({
      where: { id },
    });
  }

  async getIdentical(data: CreateScheduleDto) {
    return this.prismaService.schedule.findFirst({
      where: data,
    });
  }
}
