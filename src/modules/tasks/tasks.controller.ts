import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskDTO } from './tasks.dto';
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor';
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator';

@Controller({
  version: '1',
  path: 'projects/:projectId/tasks',
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @ValidateResourcesIds()
  findAllByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.taskService.findAllByProject(projectId);
  }

  @Post()
  @ValidateResourcesIds()
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() data: TaskDTO,
  ) {
    return this.taskService.create(projectId, data);
  }

  @Get(':taskId')
  @ValidateResourcesIds()
  findOne(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.taskService.findById(projectId, taskId);
  }

  @Put(':taskId')
  @ValidateResourcesIds()
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() data: TaskDTO,
  ) {
    return this.taskService.update(projectId, taskId, data);
  }

  @Delete(':taskId')
  @ValidateResourcesIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.taskService.delete(projectId, taskId);
  }
}
