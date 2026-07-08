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
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor';
import { CommentsService } from './comments.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CommentFullDto,
  CommentListItemDto,
  CommentRequestDto,
} from './comments.dto';
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller({
  version: '1',
  path: 'projects/:projectId/tasks/:taskId/comments',
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  @ValidateResourcesIds()
  @ApiOkResponse({
    type: [CommentListItemDto],
    description: 'Get all comments by task',
  })
  findAllByTask(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.commentService.findAllByTask(taskId);
  }

  @Get(':commentId')
  @ValidateResourcesIds()
  @ApiOkResponse({
    type: CommentFullDto,
    description: 'Get comment by Id',
  })
  findOne(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.commentService.findById(taskId, commentId);
  }

  @Post()
  @ValidateResourcesIds()
  @ApiCreatedResponse({
    type: CommentListItemDto,
    description: 'Create a new comment',
  })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() data: CommentRequestDto,
  ) {
    return this.commentService.create(taskId, data);
  }

  @Put(':commentId')
  @ValidateResourcesIds()
  @ApiOkResponse({ type: CommentListItemDto, description: 'Update comment' })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() data: CommentRequestDto,
  ) {
    return this.commentService.update(taskId, commentId, data);
  }

  @Delete(':commentId')
  @ValidateResourcesIds()
  @ApiNoContentResponse({ description: 'Delete a comment' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this.commentService.remove(taskId, commentId);
  }
}
