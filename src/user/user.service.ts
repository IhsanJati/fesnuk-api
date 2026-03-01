import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { type CreateUserRequest } from 'src/user/schemas/create-user.schema';
import { hash } from 'bcrypt';
import { UserResponse } from 'src/model/user.model';
import { type EditUserDto } from './schemas/update-user.schema';
import { SearchUserQueryDto } from './schemas/user-query.schema';
import { UsernameParamDto } from './schemas/user-param.schema';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async registerUser(data: CreateUserRequest): Promise<UserResponse> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (existingUser) {
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
      success: true,
      message: 'User register successfully',
      data: {
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
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

  async getUserByUsername(
    usernameParamDto: UsernameParamDto,
  ): Promise<UserResponse> {
    const username = usernameParamDto.username;

    const user = await this.prismaService.user.findUnique({
      where: { username },
      omit: { password: true, imageId: true },
      include: {
        post: {
          omit: { userId: true, imageId: true },
        },
        bookmarks: {
          include: {
            post: {
              omit: {
                userId: true,
                imageId: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: user,
    };
  }

  async getSearchUser(
    searchUserQueryDto: SearchUserQueryDto,
  ): Promise<UserResponse> {
    const username = searchUserQueryDto.username;

    const users = await this.prismaService.user.findMany({
      where: { username: { contains: username, mode: 'insensitive' } },
      select: { id: true, username: true, fullname: true, image: true },
    });

    if (users.length === 0) {
      throw new NotFoundException('Username not found');
    }

    return {
      success: true,
      data: users,
    };
  }

  async updateUserById(
    userId: number,
    editUserDto: EditUserDto,
  ): Promise<UserResponse> {
    const usernameTaken = await this.prismaService.user.findUnique({
      where: { username: editUserDto.username },
    });

    if (usernameTaken && usernameTaken.id !== userId) {
      throw new ConflictException('Username is already use');
    }

    const updateUser = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        username: editUserDto.username,
        bio: editUserDto.bio,
        fullname: editUserDto.fullname,
      },
      omit: { password: true },
    });

    return {
      success: true,
      message: 'Update user successfully',
      data: updateUser,
    };
  }

  async uploadAvatar(
    userId: number,
    file: Express.Multer.File,
  ): Promise<UserResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'avatars',
    );

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        imageId: uploadResult.public_id,
        image: uploadResult.secure_url,
      },
      select: {
        id: true,
        fullname: true,
        image: true,
        imageId: true,
      },
    });

    return {
      success: true,
      message: 'Upload image successfully',
      data: updatedUser,
    };
  }
}
