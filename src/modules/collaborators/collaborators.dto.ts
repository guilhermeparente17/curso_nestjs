import { ApiProperty } from '@nestjs/swagger';
import { CollaboratorRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddCollaboratorDto {
  @ApiProperty({
    description: 'User id to add as collaborator',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Collaborator Role',
    enum: CollaboratorRole,
    default: CollaboratorRole.EDITOR,
    required: false,
  })
  @IsEnum(CollaboratorRole)
  @IsOptional()
  role?: CollaboratorRole = CollaboratorRole.EDITOR;
}

export class UpdateCollaboratorDto {
  @ApiProperty({
    description: 'New collaborator Role',
    enum: CollaboratorRole,
  })
  @IsEnum(CollaboratorRole)
  @IsNotEmpty()
  role: CollaboratorRole;
}

class CollaboratorUserDto {
  @ApiProperty({}) id: string;
  @ApiProperty({}) email: string;
  @ApiProperty({ nullable: true }) avatar: string;
}

export class CollaboratorListItemDto {
  @ApiProperty() id: string;
  @ApiProperty({ enum: CollaboratorRole }) role: CollaboratorRole;
  @ApiProperty() projectId: string;
  @ApiProperty() userId: string;
  @ApiProperty({ format: 'date-time' }) createdAt: string;

  @ApiProperty({ type: CollaboratorUserDto })
  user: CollaboratorUserDto;
}
