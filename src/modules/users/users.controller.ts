import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserFullDto,
  UserListItemDto,
} from './user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller({
  version: '1',
  path: 'users',
})
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiResponse({ type: [UserListItemDto] })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':userId')
  @ApiResponse({ type: UserFullDto })
  findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    const user = this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get(':email')
  findEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Put(':userId')
  async update(
    @Body() data: UpdateUserDto,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return await this.userService.update(userId, data);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.userService.delete(userId);
  }
}
