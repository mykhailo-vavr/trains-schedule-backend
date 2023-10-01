import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  GetAllSchedulesDto,
} from './dto';
import { AuthGuard } from '../../guards';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAll(@Query() query: GetAllSchedulesDto) {
    return this.scheduleService.getAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getByPk(@Param('id') id: number) {
    return this.scheduleService.getByPk(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: number, @Body() dto: UpdateScheduleDto) {
    return this.scheduleService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: number) {
    return this.scheduleService.delete(id);
  }
}
