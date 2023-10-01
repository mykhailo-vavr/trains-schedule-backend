import { Module } from '@nestjs/common';
import { TrainService } from './train.service';

@Module({
  providers: [TrainService],
  exports: [TrainService],
})
export class TrainModule {}
