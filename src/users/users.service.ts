import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { type CreateUserRequest } from 'src/users/dto/create-user.schema';
import { hash } from 'bcrypt';
import { UserResponse } from 'src/model/user.model';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async registerUser(data: CreateUserRequest): Promise<UserResponse> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (!existingUser) {
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
    return {
      status: 'Success',
      message: 'Register Success',
    };
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

  async getUserByUsername(username: string): Promise<UserResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
      omit: { password: true, imageId: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User details',
      data: user,
    };
  }

  async getSearchUser(username: string): Promise<UserResponse> {
    const users = await this.prismaService.user.findMany({
      where: { username: { contains: username, mode: 'insensitive' } },
      select: { id: true, username: true, fullname: true, image: true },
    });

    if (users.length === 0) {
      throw new NotFoundException('Username not found');
    }

    return {
      message: 'Searching user',
      data: users,
    };
  }
}
