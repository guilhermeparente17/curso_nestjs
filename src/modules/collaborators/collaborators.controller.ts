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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator';
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor';
import { PrismaService } from 'src/prisma.service';
import {
  AddCollaboratorDto,
  CollaboratorListItemDto,
  UpdateCollaboratorDto,
} from './collaborators.dto';
import { CollaboratorsService } from './collaborators.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller({
  version: '1',
  path: 'projects/:projectId/collaborators',
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
@UseGuards(JwtAuthGuard)
export class CollaboratorsController {
  constructor(private readonly collaboratorService: CollaboratorsService) {}

  @Get()
  @ValidateResourcesIds()
  @ApiResponse({ type: [CollaboratorListItemDto] })
  findAllByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.collaboratorService.findAllByProject(projectId);
  }

  @Post()
  @ValidateResourcesIds()
  @ApiCreatedResponse({ type: CollaboratorListItemDto })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() data: AddCollaboratorDto,
  ) {
    return this.collaboratorService.create(projectId, data);
  }

  @Put(':userId')
  @ValidateResourcesIds()
  @ApiResponse({
    type: CollaboratorListItemDto,
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() data: UpdateCollaboratorDto,
  ) {
    return this.collaboratorService.update(projectId, userId, data);
  }

  @Delete(':userId')
  @ValidateResourcesIds()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    this.collaboratorService.remove(projectId, userId);
  }
}
