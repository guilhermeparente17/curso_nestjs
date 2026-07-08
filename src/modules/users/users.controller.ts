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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserFullDto,
  UserListItemDto,
} from './user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequestContextService } from 'src/common/services/request-context.service';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  version: '1',
  path: 'users',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly requestContext: RequestContextService,
  ) {}

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

  @Post('/avatar')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Upload avatar uploaded successfully',
    type: UserListItemDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const user = this.requestContext.getUser();
    console.log(user);

    const response = await this.cloudinaryService.upload(file, user.id);

    // const user = await this.userService.findById(user.id);

    await this.userService.update(user.id, {
      ...user,
      avatar: response.url,
    });

    return this.userService.findById(user.id);
  }
}
