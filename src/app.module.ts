import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './modules/projects/projects.module';
import { PrismaService } from './prisma.service';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CollaboratorsModule } from './modules/collaborators/collaborators.module';
import { CommentsModule } from './modules/comments/comments.module';
import { RequestContextService } from './common/services/request-context.service';
import { MailModule } from './modules/mail/mail.module';
import { CloudinaryService } from './common/services/cloudinary/cloudinary.service';

@Module({
  imports: [
    ProjectsModule,
    TasksModule,
    UsersModule,
    AuthModule,
    CollaboratorsModule,
    CommentsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    RequestContextService,
    CloudinaryService,
  ],
})
export class AppModule {}
