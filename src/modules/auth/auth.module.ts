import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user';
import { HashService } from '../../services';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, HashService],
})
export class AuthModule {}
