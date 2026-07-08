import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { RequestContextService } from 'src/common/services/request-context.service';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    RequestContextService,
    CloudinaryService,
  ],
})
export class UsersModule {}
