import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'nestjs-swagger-dto';
import { StudysetResponseDto } from '../studyset/studyset.dto';
import { VisualsetResponseDto } from '../visualset/visualset.dto';
import { IsUUID } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({
    description: 'Naam van de folder',
    example: 'Anatomie Studies',
    minLength: 1,
    maxLength: 100,
  })
  @IsString({
    name: 'name',
    minLength: 1,
    maxLength: 100,
  })
  name: string;
  
}

export class UpdateFolderDto {
  @ApiProperty({
    description: 'Nieuwe naam voor de folder',
    example: 'Anatomie Studies - Updated',
    minLength: 1,
    maxLength: 100,
    required: false,
  })
  @IsString({
    name: 'name',
    minLength: 1,
    maxLength: 100,
    optional: true,
  })
  name?: string;
}

export class FolderResponseDto {
  @ApiProperty({
    description: 'UUID van de folder',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Naam van de folder',
    example: 'Anatomie Studies',
  })
  name: string;

  @ApiProperty({
    description: 'UUID van de eigenaar',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  owner_id: string;
}

export class FolderSetsDto {
  @ApiProperty({
    description: 'Lijst van studysets in de folder',
    type: [StudysetResponseDto],
  })
  studysets: StudysetResponseDto[];

  @ApiProperty({
    description: 'Lijst van visualsets in de folder',
    type: [VisualsetResponseDto],
  })
  visualsets: VisualsetResponseDto[];
}

export class FullFolderResponseDto {
  @ApiProperty({
    description: 'UUID van de folder',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Naam van de folder',
    example: 'Anatomie Studies',
  })
  name: string;

  @ApiProperty({
    description: 'UUID van de eigenaar',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  owner_id: string;

  @ApiProperty({
    description: 'Alle sets in de folder',
    type: FolderSetsDto,
  })
  sets: FolderSetsDto;
}

export class FolderListResponseDto {
  @ApiProperty({
    description: 'Lijst van alle folders',
    type: [FolderResponseDto],
  })
  folders: FolderResponseDto[];
}

export class SwitchFolderDto {
  @ApiProperty({
    description: 'UUID van de gebruiker',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    minLength: 20,
  })
  @IsString({
    name: 'user_id',
    minLength: 20,
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'UUID van de set die verplaatst wordt',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    minLength: 20,
  })
  @IsString({
    name: 'set_id',
    minLength: 20,
  })
  @IsUUID()
  set_id: string;

  @ApiProperty({
    description: 'UUID van de doelfolder',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    minLength: 20,
  })
  @IsString({
    name: 'destinationFolder_id',
    minLength: 20,
  })
  @IsUUID()
  destinationFolder_id: string;
}
