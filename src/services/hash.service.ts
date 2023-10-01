import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hash(password: string, saltRounds = 10) {
    return bcrypt.hash(password, saltRounds);
  }

  async validate(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
