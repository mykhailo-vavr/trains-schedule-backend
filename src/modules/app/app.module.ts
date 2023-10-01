import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth';
import { ScheduleModule } from '../schedule';
import { PrismaModule } from '../prisma';

@Module({
  imports: [
    AuthModule,
    ScheduleModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: new ConfigService().getOrThrow('ACCESS_TOKEN_SECRET'),
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
