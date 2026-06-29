import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TaskDTO } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: {
        projectId,
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async findById(projectId: string, taskId: string) {
    return this.prisma.task.findFirst({
      where: {
        projectId,
        id: taskId,
      },
    });
  }

  async create(projectId: string, data: TaskDTO) {
    return this.prisma.task.create({
      data: {
        ...data,
        projectId,
      },
    });
  }

  async update(projectId: string, taskId: string, data: TaskDTO) {
    return this.prisma.task.update({
      where: {
        id: taskId,
        projectId,
      },
      data,
    });
  }

  async delete(projectId: string, taskId: string) {
    return await this.prisma.task.delete({
      where: {
        projectId,
        id: taskId,
      },
    });
  }
}
