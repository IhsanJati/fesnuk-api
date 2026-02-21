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
    const emailUseCount = await this.prismaService.user.count({
      where: { email: data.email },
    });

    if (emailUseCount > 0) {
      throw new ConflictException('Email has already exist');
    }

    const hashedPassword = await hash(data.password, 10);

    const newUser = await this.prismaService.user.create({
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
      data: {
        id: newUser.id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        image: newUser.image,
        bio: newUser.bio,
      },
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
}
