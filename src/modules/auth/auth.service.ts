import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../../services';
import { SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.getByUsername(username);

    if (!user) {
      throw new NotFoundException('Username or password are incorrect');
    }

    const validPassword = await this.hashService.validate(
      password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Password or email are incorrect');
    }

    const accessToken = await this.jwtService.signAsync({ userId: user.id });

    return { accessToken };
  }

  async signUp({ username, password }: SignUpDto) {
    const existedUser = await this.userService.getByUsername(username);

    if (existedUser) {
      throw new ConflictException('User with such username is already exists');
    }

    const hashedPassword = await this.hashService.hash(password);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...user } = await this.userService.create({
      username,
      password: hashedPassword,
    });

    return user;
  }
}
