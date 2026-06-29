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
import { ProjectsService } from './projects.service';
import {
  ProjectFullDTO,
  ProjectListItemDTO,
  ProjectRequestDTO,
} from './projects.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator';
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor';

@Controller({
  version: '1',
  path: 'projects',
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiResponse({
    type: [ProjectListItemDTO],
  })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':projectId')
  @ApiResponse({
    type: ProjectFullDTO,
  })
  @ValidateResourcesIds()
  async findOne(@Param('projectId', ParseUUIDPipe) id: string) {
    return await this.projectsService.findById(id);
  }

  @Post()
  @ApiResponse({
    type: ProjectFullDTO,
  })
  create(@Body() data: ProjectRequestDTO) {
    return this.projectsService.create(data);
  }

  @Put(':projectId')
  @ApiResponse({
    type: ProjectFullDTO,
  })
  @ValidateResourcesIds()
  async update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() data: ProjectRequestDTO,
  ) {
    return this.projectsService.update(projectId, data);
  }

  @Delete(':projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  async remove(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.projectsService.remove(projectId);
  }
}
