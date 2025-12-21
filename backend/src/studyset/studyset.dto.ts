import { CardResponseDto, CreateCardListDto, UpdateCardDto } from './card.dto';
import { VisualsetResponseDto } from '../visualset/visualset.dto';
import { StudysessionResponseDto } from '../studysession/studysession.dto';
import { ClassroomResponseDto } from '../classroom/classroom.dto';
import { FolderResponseDto } from '../folder/folder.dto';
import { IsString } from 'nestjs-swagger-dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SetLikeResponseDto } from './setlike.dto';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateStudysetDto {
  @ApiProperty({
    example: 'Heart Diagram',
    description: 'Title of the studyset',
  })
  @IsString({ name: 'title', maxLength: 200 })
  title: string;

  @ApiProperty({
    example: 'English',
    description: 'Course of the studyset',
  })
  @IsString({ name: 'course', maxLength: 100 })
  course: string;

  @ApiProperty({
    example: 'en',
    description: 'Language of the terms of the studyset (ISO 639-1 code)',
  })
  @IsString({ name: 'global_term_language', maxLength: 2 })
  global_term_language: string;

  @ApiProperty({
    example: 'nl',
    description: 'Language of the definitions of the studyset (ISO 639-1 code)',
  })
  @IsString({ name: 'global_definition_language', maxLength: 2 })
  global_definition_language: string;

  @ApiProperty({
    example: 'f45cd674-73a5-4d4f-abdb-b405981cd2b3',
    description: 'Folder ID where the studyset belongs',
  })
  @IsString({ name: 'folder_id', maxLength: 64 })
  folder_id: string;

  @ApiProperty({
    description: 'List of cards in the studyset',
    type: [CreateCardListDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCardListDto)
  @ArrayMinSize(1)
  cardlist: CreateCardListDto[];
}

export class UpdateStudysetDto {
  @ApiProperty({
    example: 'Updated Heart Diagram',
    description: 'Updated title of the studyset',
    required: false,
  })
  @IsString({ name: 'title', maxLength: 200 })
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Biology',
    description: 'Updated course of the studyset',
    required: false,
  })
  @IsString({ name: 'course', maxLength: 100 })
  @IsOptional()
  course?: string;

  @ApiProperty({
    example: 'en',
    description: 'Updated language of the terms (ISO 639-1 code)',
    required: false,
  })
  @IsString({ name: 'global_term_language', maxLength: 2 })
  @IsOptional()
  global_term_language?: string;

  @ApiProperty({
    example: 'nl',
    description: 'Updated language of the definitions (ISO 639-1 code)',
    required: false,
  })
  @IsString({ name: 'global_definition_language', maxLength: 2 })
  @IsOptional()
  global_definition_language?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the studyset is public or private',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  public_set?: boolean;

  @ApiProperty({
    description: 'Updated list of cards',
    type: [UpdateCardDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCardDto)
  @IsOptional()
  cards?: UpdateCardDto[];
}

export class StudysetResponseDto {
  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'Unique identifier of the studyset',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Heart Diagram',
    description: 'Title of the studyset',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: 'English',
    description: 'Course name',
  })
  @Expose()
  course: string;

  @ApiProperty({
    example: 'en',
    description: 'Language code of the terms',
  })
  @Expose()
  global_term_language: string;

  @ApiProperty({
    example: 'nl',
    description: 'Language code of the definitions',
  })
  @Expose()
  global_definition_language: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Creation timestamp',
  })
  @Expose()
  created_at: string;

  @ApiProperty({
    example: '2024-01-20T14:45:00.000Z',
    description: 'Last update timestamp',
  })
  @Expose()
  last_updated: string;

  @ApiProperty({
    example: true,
    description: 'Whether the studyset is publicly visible',
  })
  @Expose()
  public_set: boolean;

  @ApiProperty({
    example: 'Emile Duyck',
    description: 'Display name of the owner',
  })
  @Expose()
  displayName: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Profile picture URL of the owner',
  })
  @Expose()
  img_url: string;

  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'User ID of the owner',
  })
  @Expose()
  user_id: string;

  @ApiProperty({
    example: '2f1cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'Folder ID where the studyset belongs',
  })
  @Expose()
  folder_id: string;
}

export class fullSetResponseDto extends StudysetResponseDto {
  @ApiProperty({
    description: 'List of cards in the studyset',
    type: [CardResponseDto],
  })
  @Expose()
  cards: CardResponseDto[];

  @ApiProperty({
    description: 'List of likes on the studyset',
    type: [SetLikeResponseDto],
  })
  @Expose()
  likes: SetLikeResponseDto[];

  @ApiProperty({
    description: 'Active study session for this studyset',
    type: StudysessionResponseDto,
    required: false,
  })
  @Expose()
  session: StudysessionResponseDto | undefined;

  @ApiProperty({
    description: 'Classrooms where this studyset is used',
    type: [ClassroomResponseDto],
    required: false,
  })
  @Expose()
  classrooms: ClassroomResponseDto[] | undefined;

  @ApiProperty({
    description: 'Folders containing this studyset',
    type: [FolderResponseDto],
    required: false,
  })
  @Expose()
  folders: FolderResponseDto[] | undefined;
  
}

export class StudysetListResponseDto {
  @ApiProperty({
    description: 'List of studysets',
    type: [StudysetResponseDto],
  })
  @Expose()
  sets: StudysetResponseDto[];
}

export class AllsetsResponseDto {
  @ApiProperty({
    description: 'List of studysets',
    type: [StudysetResponseDto],
  })
  @Expose()
  studysets: StudysetResponseDto[];

  @ApiProperty({
    description: 'List of visualsets',
    type: [VisualsetResponseDto],
  })
  @Expose()
  visualsets: VisualsetResponseDto[];
}
