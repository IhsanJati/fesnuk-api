import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInSchema, type SignInDto } from './dto/signIn.schema';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { CurrentUser } from 'src/common/current-user.decorator';
import type { JwtPayload } from 'src/model/auth.model';
import { ZodValidationPipe } from 'src/common/zod.pipe';
import {
  type CreateUserRequest,
  registerUserSchema,
} from 'src/users/dto/create-user.schema';
import { UserResponse } from 'src/model/user.model';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async registerUser(@Body() data: CreateUserRequest): Promise<UserResponse> {
    return await this.userService.registerUser(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ZodValidationPipe(signInSchema))
  signIn(@Body() SignInDto: SignInDto) {
    return this.authService.signIn(SignInDto.email, SignInDto.password);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@CurrentUser() user: JwtPayload) {
    return await this.userService.getUserById(user.sub);
  }
}
