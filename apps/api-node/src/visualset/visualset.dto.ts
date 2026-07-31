import { CreatePinDto, PinResponseListDto, UpdatePinDto } from '../pin/pin.dto';
import { SetLikeResponseListDto } from '../studyset/setlike.dto';
import { StudysessionResponseDto } from '../studysession/studysession.dto';
import { IsString, IsNumber } from 'nestjs-swagger-dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ClassroomResponseDto } from '../classroom/classroom.dto';
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
    description: 'tells if the set is created by studo',
  })
  @Expose()
  studoset: boolean;

  @ApiProperty({
    example: '2024-01-01T10:00:00.000Z',
    description: 'Creation date',
  })
  @Expose()
  createdAt: string;

  @ApiProperty({
    example: '2024-01-10T10:00:00.000Z',
    description: 'Last updated date',
  })
  @Expose()
  lastUpdated: string;

  @ApiProperty({
    example: true,
    description: 'Whether the set is public',
  })
  @Expose()
  publicSet: boolean;

  @ApiProperty({
    example: 'user123',
    description: 'User ID of the creator',
  })
  @Expose()
  userId: string;

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
  imgUrl: string;

  @ApiProperty({ example: 8, required: false })
  @Expose()
  pinCount?: number;

  @ApiProperty({ example: '2024-09-01T10:00:00.000Z', required: false })
  @Expose()
  lastStudied?: string | null;

  @ApiProperty({ example: 75, required: false })
  @Expose()
  progress?: number;
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
    example: '2024-01-01T10:00:00.000Z',
    description: 'Creation date',
  })
  @Expose()
  createdAt: string;

  @ApiProperty({
    example: '2024-01-10T10:00:00.000Z',
    description: 'Last updated date',
  })
  @Expose()
  lastUpdated: string;

  @ApiProperty({
    example: 'user123',
    description: 'User ID of the creator',
  })
  @Expose()
  userId: string;

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
  gridX: number;

  @ApiProperty({
    example: 0,
    description: 'Grid Y positie',
  })
  @IsNumber({
    name: 'grid_y',
    format: 'int32',
    type: 'integer',
  })
  gridY: number;

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
  gridX: number;

  @ApiProperty({
    example: 0,
    description: 'Grid Y positie',
  })
  @Expose()
  gridY: number;

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
  setId: string;
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
  gridX: number;

  @ApiProperty({
    example: 0,
    description: 'Grid Y positie',
  })
  @Expose()
  gridY: number;

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
  setId: string;

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
  publicSet?: boolean;

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
