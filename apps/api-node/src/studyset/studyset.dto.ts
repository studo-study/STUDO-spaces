import { CardResponseDto, CreateCardDto, UpdateCardDto } from './card.dto';
import { VisualsetResponseDto } from '../visualset/visualset.dto';

import { StudysessionResponseDto } from '../studysession/studysession.dto';
import { ClassroomResponseDto } from '../classroom/classroom.dto';
import { IsBoolean, IsString } from 'nestjs-swagger-dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SetLikeResponseDto } from './setlike.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  ValidateNested,
  IsString as IsStringValidator,
} from 'class-validator';

export class CreateStudysetDto {
  @ApiProperty({
    example: 'Heart Diagram',
    description: 'Title of the studoset',
  })
  @IsString({ name: 'title', maxLength: 200 })
  title: string;

  @ApiProperty({
    example: 'en',
    description: 'Language of the terms of the studoset (ISO 639-1 code)',
  })
  @IsString({ name: 'global_term_language', maxLength: 2 })
  globalTermLanguage: string;

  @ApiProperty({
    example: 'nl-NL',
    description: 'Language of the definitions of the studoset (ISO 639-1 code)',
  })
  @IsString({ name: 'global_definition_language', maxLength: 2 })
  globalDefinitionLanguage: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCardDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  cardlist: CreateCardDto[];
}

export class UpdateStudysetDto {
  @ApiProperty({
    example: 'Updated Heart Diagram',
    description: 'Updated title of the studoset',
    required: false,
  })
  @IsString({ name: 'title', maxLength: 200 })
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'en',
    description: 'Updated language of the terms (ISO 639-1 code)',
    required: false,
  })
  @IsString({ name: 'global_term_language', maxLength: 2 })
  @IsOptional()
  globalTermLanguage?: string;

  @ApiProperty({
    example: 'nl-NL',
    description: 'Updated language of the definitions (ISO 639-1 code)',
    required: false,
  })
  @IsString({ name: 'global_definition_language', maxLength: 2 })
  @IsOptional()
  globalDefinitionLanguage?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the studoset is public or private',
    required: false,
  })
  @IsBoolean({ name: 'public_set', optional: true })
  publicSet?: boolean;

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

  @ApiProperty({
    description: 'Full card replacement list (replaces all existing cards)',
    type: [CreateCardDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCardDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @IsOptional()
  cardlist?: CreateCardDto[];
}

export class StudysetResponseDto {
  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'Unique identifier of the studoset',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Heart Diagram',
    description: 'Title of the studoset',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: 'en',
    description: 'Language code of the terms',
  })
  @Expose()
  globalTermLanguage: string;

  @ApiProperty({
    example: 'nl-NL',
    description: 'Language code of the definitions',
  })
  @Expose()
  globalDefinitionLanguage: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Creation timestamp',
  })
  @Expose()
  createdAt: string;

  @ApiProperty({
    example: '2024-01-20T14:45:00.000Z',
    description: 'Last update timestamp',
  })
  @Expose()
  lastUpdated: string;

  @ApiProperty({
    example: true,
    description: 'Whether the studoset is publicly visible',
  })
  @Expose()
  publicSet: boolean;

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
  imgUrl: string;

  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'User ID of the owner',
  })
  @Expose()
  userId: string;

  @ApiProperty({ example: 12, required: false })
  @Expose()
  cardCount?: number;

  @ApiProperty({ example: '2024-09-01T10:00:00.000Z', required: false })
  @Expose()
  lastStudied?: string | null;

  @ApiProperty({ example: 75, required: false })
  @Expose()
  progress?: number;
}

export class fullSetResponseDto extends StudysetResponseDto {
  @ApiProperty({
    description: 'List of cards in the studoset',
    type: [CardResponseDto],
  })
  @Expose()
  cards: CardResponseDto[];

  @ApiProperty({
    description: 'List of likes on the studoset',
    type: [SetLikeResponseDto],
  })
  @Expose()
  likes: SetLikeResponseDto[];

  @ApiProperty({
    description: 'Active studygroup session for this studoset',
    type: StudysessionResponseDto,
    required: false,
  })
  @Expose()
  session: StudysessionResponseDto | undefined;

  @ApiProperty({
    description: 'Classrooms where this studoset is used',
    type: [ClassroomResponseDto],
    required: false,
  })
  @Expose()
  classrooms: ClassroomResponseDto[] | undefined;
}

export class UserStatsDto {
  @ApiProperty({ example: 12 }) totalsets: number;
  @ApiProperty({ example: 340 }) timeLearned: number;
  @ApiProperty({ example: 200 }) totalCards: number;
  @ApiProperty({ example: 150 }) cardsLearned: number;
}

export class MyStudysetsResponseDto {
  @ApiProperty({ type: [StudysetResponseDto] })
  sets: StudysetResponseDto[];

  @ApiProperty({ type: [VisualsetResponseDto] })
  visualsets: VisualsetResponseDto[];

  @ApiProperty({ type: UserStatsDto })
  stats: UserStatsDto;
}

export class StudysetListResponseDto {
  @ApiProperty({
    description: 'List of studosets',
    type: [StudysetResponseDto],
  })
  @Expose()
  sets: StudysetResponseDto[];
}

export class AllsetsResponseDto {
  @ApiProperty({
    description: 'List of studosets',
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
