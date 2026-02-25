import { CreatePinDto, PinResponseListDto, UpdatePinDto } from '../pin/pin.dto';
import { SetLikeResponseListDto } from '../studyset/setlike.dto';
import { StudysessionResponseDto } from '../studysession/studysession.dto';
import { IsString, IsNumber } from 'nestjs-swagger-dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  ClassroomListResponseDto,
  ClassroomResponseDto,
} from '../classroom/classroom.dto';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class VisualsetResponseDto {
  @ApiProperty({
    example: 'vs123',
    description: 'ID of the ((visualset))',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'The Human Body',
    description: 'Title of the ((visualset))',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: 'Biology',
    description: 'Course name',
  })
  @Expose()
  course: string;

  @ApiProperty({
    example: '2024-01-01T10:00:00.000Z',
    description: 'Creation date',
  })
  @Expose()
  created_at: string;

  @ApiProperty({
    example: '2024-01-10T10:00:00.000Z',
    description: 'Last updated date',
  })
  @Expose()
  last_updated: string;

  @ApiProperty({
    example: true,
    description: 'Whether the set is public',
  })
  @Expose()
  public_set: boolean;

  @ApiProperty({
    example: 'user123',
    description: 'User ID of the creator',
  })
  @Expose()
  user_id: string;

  @ApiProperty({
    example: 'Charles',
    description: 'Display name of the creator',
  })
  @Expose()
  displayName: string;

  @ApiProperty({
    example: 'https://example.com/avatar.png',
    description: 'Profile picture of the creator',
  })
  @Expose()
  img_url: string;

  @ApiProperty({
    example: 'folder123',
    description: 'Folder ID',
  })
  @Expose()
  folder_id: string;
}

export class PublicVisualsetResponseDto {
  @ApiProperty({
    example: 'vs123',
    description: 'ID of the ((visualset))',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'The Human Body',
    description: 'Title of the ((visualset))',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: 'Biology',
    description: 'Course name',
  })
  @Expose()
  course: string;

  @ApiProperty({
    example: '2024-01-01T10:00:00.000Z',
    description: 'Creation date',
  })
  @Expose()
  created_at: string;

  @ApiProperty({
    example: '2024-01-10T10:00:00.000Z',
    description: 'Last updated date',
  })
  @Expose()
  last_updated: string;

  @ApiProperty({
    example: 'user123',
    description: 'User ID of the creator',
  })
  @Expose()
  user_id: string;

  @ApiProperty({
    example: 'Charles',
    description: 'Display name of the creator',
  })
  @Expose()
  displayName: string;
}

//images
export class CreateImageDto {
  @ApiProperty({
    example: 'Heart Diagram',
    description: 'Titel vand de image',
  })
  @IsString({ name: 'title', maxLength: 100 })
  title: string;

  @ApiProperty({
    example: 'https://example.com/heart.png',
    description: 'URL van de image',
  })
  @IsString({ name: 'url', maxLength: 250 })
  url: string;

  @ApiProperty({
    example: 0,
    description: 'Index van de image',
  })
  @IsNumber({
    name: 'index',
    format: 'int32',
    type: 'integer',
  })
  index: number;

  @ApiProperty({
    example: 0,
    description: 'Grid X positie',
  })
  @IsNumber({
    name: 'grid_x',
    format: 'int32',
    type: 'integer',
  })
  grid_x: number;

  @ApiProperty({
    example: 0,
    description: 'Grid Y positie',
  })
  @IsNumber({
    name: 'grid_y',
    format: 'int32',
    type: 'integer',
  })
  grid_y: number;

  @ApiProperty({
    example: '1',
    description: 'Schaal van de image',
  })
  @IsString({ name: 'scale', maxLength: 64 })
  scale: string;
}

export class UpdateImgDto extends CreateImageDto {
  @ApiProperty({
    example: 'img123',
    description: 'ID van de image',
  })
  @IsString({
    name: 'id',
    maxLength: 64,
  })
  id: string;
}

export class ImageDto {
  @ApiProperty({
    example: 'img123',
    description: 'ID van de image',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Heart Diagram',
    description: 'Titel van de image',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: 'https://example.com/heart.png',
    description: 'URL van de image',
  })
  @Expose()
  url: string;

  @ApiProperty({
    example: 0,
    description: 'Index van de image',
  })
  @Expose()
  index: number;

  @ApiProperty({
    example: 0,
    description: 'Grid X positie',
  })
  @Expose()
  grid_x: number;

  @ApiProperty({
    example: 0,
    description: 'Grid Y positie',
  })
  @Expose()
  grid_y: number;

  @ApiProperty({
    example: '1',
    description: 'Scale of the image',
  })
  @Expose()
  scale: string;

  @ApiProperty({
    example: 'vs123',
    description: 'Visualset ID',
  })
  @Expose()
  set_id: string;
}

export class ImageResponseDto {
  @ApiProperty({
    example: 'img123',
    description: 'ID of the image',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Heart Diagram',
    description: 'Title of the image',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: 'https://example.com/heart.png',
    description: 'URL of the image',
  })
  @Expose()
  url: string;

  @ApiProperty({
    example: 0,
    description: 'Index of the image',
  })
  @Expose()
  index: number;

  @ApiProperty({
    example: 0,
    description: 'Grid X position',
  })
  @Expose()
  grid_x: number;

  @ApiProperty({
    example: 0,
    description: 'Grid Y positie',
  })
  @Expose()
  grid_y: number;

  @ApiProperty({
    example: '1',
    description: 'schaal of the image',
  })
  @Expose()
  scale: string;

  @ApiProperty({
    example: 'vs123',
    description: 'Visualset ID',
  })
  @Expose()
  set_id: string;

  @ApiProperty({
    type: PinResponseListDto,
    description: 'Pins op de image',
  })
  @Expose()
  pins: PinResponseListDto;
}

//alles teruggeven
export class FullVSResponseListDto extends VisualsetResponseDto {
  @ApiProperty({
    type: [ImageResponseDto],
    description: 'Images in de ((visualset))',
  })
  @Expose()
  images: ImageResponseDto[];

  @ApiProperty({
    type: SetLikeResponseListDto,
    description: 'Likes van ((visualset))',
  })
  @Expose()
  likes: SetLikeResponseListDto;

  @ApiProperty({
    type: StudysessionResponseDto,
    description: 'Study session data',
    required: false,
  })
  @Expose()
  session: StudysessionResponseDto;

  @ApiProperty({
    type: StudysessionResponseDto,
    description: 'classroosm van de set',
    required: false,
  })
  @Expose()
  classrooms: ClassroomResponseDto[];
}

export class VisualsetResponseListDto {
  @ApiProperty({
    type: [VisualsetResponseDto],
    description: 'List of visualsets',
  })
  @Expose()
  visualsets: VisualsetResponseDto[];
}

export class CreateVisualsetDto {
  @ApiProperty({
    example: 'the human body',
    description: 'The title of the ((visualset))',
  })
  @IsString({
    name: 'title',
    maxLength: 200,
  })
  title: string;

  @ApiProperty({
    example: 'Biology',
    description: 'Subject of the ((visualset))',
  })
  @IsString({ name: 'subject', maxLength: 100 })
  subject: string;

  @ApiProperty({
    example: 'folder123',
    description: 'Folder ID',
  })
  @IsString({ name: 'folder_id', maxLength: 64 })
  folder_id: string;

  @ApiProperty({
    type: [CreateImageDto],
    description: 'Images in the ((visualset))',
  })
  images: CreateImageDto[];

  @ApiProperty({
    type: [CreatePinDto],
    description: 'Pins on the ((visualset))',
  })
  pins: CreatePinDto[];
}

export class UpdateVisualsetDto {
  @ApiProperty({
    example: 'Updated title',
    description: 'Updated title',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the studoset is public or private',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  public_set?: boolean;

  @ApiProperty({
    example: 'Chemistry',
    description: 'Updated course',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  course?: string;

  @ApiProperty({
    example: 'folder123',
    description: 'Folder ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  folder_id?: string;

  @ApiProperty({
    type: [UpdateImgDto],
    required: false,
    description: 'Updated images',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateImgDto)
  images?: UpdateImgDto[];

  @ApiProperty({
    type: [UpdatePinDto],
    required: false,
    description: 'Updated pins',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePinDto)
  pins?: UpdatePinDto[];
}
