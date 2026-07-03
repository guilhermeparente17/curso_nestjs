import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDTO, SignUpDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator';
import type { User } from '@prisma/client';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  signup(@Body() data: SignUpDTO) {
    return this.authService.signup(data);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() data: SignInDTO) {
    return this.authService.signIn(data);
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protected(@AuthenticatedUser() user: User) {
    return {
      message: `Authenticated ${user.name}`,
    };
  }
}
