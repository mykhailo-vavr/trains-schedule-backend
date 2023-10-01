import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByPk(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('There is no user with such id');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...data } = user;
    return data;
  }

  async getByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: { username },
    });
  }

  async create({ username, password }: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data: {
        username,
        password,
      },
    });
  }
}
