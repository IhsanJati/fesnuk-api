import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInSchema, type SignInDto } from './schemas/signIn.schema';
import { UserService } from 'src/user/user.service';
import { ZodValidationPipe } from 'src/common/zod.pipe';
import {
  type CreateUserRequest,
  registerUserSchema,
} from 'src/user/schemas/create-user.schema';
import { UserResponse } from 'src/model/user.model';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/register')
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async registerUser(@Body() data: CreateUserRequest): Promise<UserResponse> {
    return await this.userService.registerUser(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @UsePipes(new ZodValidationPipe(signInSchema))
  signIn(@Body() SignInDto: SignInDto): Promise<UserResponse> {
    return this.authService.signIn(SignInDto.email, SignInDto.password);
  }
}
