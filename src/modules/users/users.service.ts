import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
        role: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
        role: true,
        createdProjects: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    await this.prisma.project.deleteMany({
      where: {
        createdById: id,
      },
    });

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
