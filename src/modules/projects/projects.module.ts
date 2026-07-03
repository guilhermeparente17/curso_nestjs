import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from 'src/prisma.service';
import { RequestContextService } from 'src/common/services/request-context.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, RequestContextService],
})
export class ProjectsModule {}
