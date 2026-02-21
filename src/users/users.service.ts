import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { type CreateUserRequest } from 'src/users/dto/create-user.schema';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async registerUser(data: CreateUserRequest) {
    const emailUseCount = await this.prismaService.user.count({
      where: { email: data.email },
    });

    if (emailUseCount > 0) {
      throw new ConflictException('Email has already exist');
    }

    const hashedPassword = await hash(data.password, 10);

    await this.prismaService.user.create({
      data: {
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });
    return { status: 'success', message: 'User created' };
  }

  async getUserById(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      username: user.username,
      fullname: user.fullname,
      email: user.email,
    };
  }

  async getUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }
}
