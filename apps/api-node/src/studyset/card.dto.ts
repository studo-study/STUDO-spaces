import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber } from 'nestjs-swagger-dto';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';

export class CreateCardDto {
  @ApiProperty({
    example: 'Photosynthesis',
    description: 'Term van de kaart',
  })
  @IsString({ name: 'term', maxLength: 512 })
  @IsNotEmpty()
  term: string;

  @ApiProperty({
    example:
      'Process by which plants convert light energy into chemical energy',
    description: 'Definitie van de kaart',
  })
  @IsString({ name: 'definition', maxLength: 512 })
  @IsNotEmpty()
  definition: string;

  @ApiProperty({
    example: 'abc123',
    description: 'ID van de geselecteerde suggestion image',
    nullable: true,
    required: false,
  })
  @IsString({ name: 'suggestion_image_id', maxLength: 64 })
  @IsOptional()
  suggestionImageId?: string | null;

  @ApiProperty({
    example: 1,
    description: 'Nummer van de kaart (volgorde)',
  })
  @IsNumber({ name: 'number' })
  @IsNotEmpty()
  number: number;

  @ApiPropertyOptional({
    example: 'text',
    description: 'Content type van de term: text, latex of code',
    enum: ['text', 'latex', 'code'],
  })
  @IsOptional()
  @IsIn(['text', 'latex', 'code'])
  termContentType?: 'text' | 'latex' | 'code';

  @ApiPropertyOptional({
    example: 'typescript',
    description: 'Programmeertaal voor code cards',
  })
  @IsString({ name: 'code_language', maxLength: 32 })
  @IsOptional()
  codeLanguage?: string;
}

export class CreateCardListDto {
  @ApiProperty({
    type: [CreateCardDto],
    description: 'Lijst van kaarten',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCardDto)
  @ArrayMinSize(1)
  cards: CreateCardDto[];
}

export class UpdateCardDto {
  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de kaart',
  })
  @IsString({ name: 'id', maxLength: 64 })
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({
    example: 'Updated Photosynthesis',
    description: 'Bijgewerkte term van de kaart',
  })
  @IsString({ name: 'term', maxLength: 128 })
  @IsOptional()
  term?: string;

  @ApiPropertyOptional({
    example: 'Updated definition text',
    description: 'Bijgewerkte definitie van de kaart',
  })
  @IsString({ name: 'definition', maxLength: 128 })
  @IsOptional()
  definition?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Bijgewerkt nummer van de kaart',
  })
  @IsNumber({ name: 'number' })
  @IsOptional()
  number?: number;

  @ApiProperty({
    example: 'abc123',
    description: 'ID van de geselecteerde suggestion image',
    nullable: true,
    required: false,
  })
  @IsString({ name: 'suggestion_image_id', maxLength: 64 })
  @IsOptional()
  suggestionImageId?: string | null;

  @ApiPropertyOptional({
    example: '2024-01-20T14:45:00.000Z',
    description: 'Laatste update timestamp',
  })
  @IsString({ name: 'updated_at', maxLength: 24 })
  @IsOptional()
  updatedAt?: string;

  @ApiPropertyOptional({
    example: 'text',
    description: 'Content type van de term: text, latex of code',
    enum: ['text', 'latex', 'code'],
  })
  @IsOptional()
  @IsIn(['text', 'latex', 'code'])
  termContentType?: 'text' | 'latex' | 'code';

  @ApiPropertyOptional({
    example: 'typescript',
    description: 'Programmeertaal voor code cards',
  })
  @IsString({ name: 'code_language', maxLength: 32 })
  @IsOptional()
  codeLanguage?: string;
}

export class CardResponseDto {
  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de kaart',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Photosynthesis',
    description: 'Term van de kaart',
  })
  @Expose()
  term: string;

  @ApiProperty({
    example:
      'Process by which plants convert light energy into chemical energy',
    description: 'Definitie van de kaart',
  })
  @Expose()
  definition: string;

  @ApiProperty({
    example: 1,
    description: 'Nummer van de kaart (volgorde)',
  })
  @Expose()
  number: number;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Aanmaak timestamp',
  })
  @Expose()
  createdAt: string;

  @ApiProperty({
    example: '2024-01-20T14:45:00.000Z',
    description: 'Laatste update timestamp',
  })
  @Expose()
  updatedAt: string;

  @ApiProperty({
    example: '2f1cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de studoset',
  })
  @Expose()
  setId: string;

  @ApiProperty({
    example: '3a2cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de eigenaar',
  })
  @Expose()
  ownerId: string;

  @ApiProperty({
    example: 'text',
    description: 'Content type van de term: text, latex of code',
    enum: ['text', 'latex', 'code'],
  })
  @Expose()
  termContentType: 'text' | 'latex' | 'code';

  @ApiProperty({
    example: 'typescript',
    description: 'Programmeertaal voor code cards',
  })
  @Expose()
  codeLanguage: string;

  @ApiProperty({
    example: 'abc123',
    description: 'ID van de geselecteerde suggestion image',
    nullable: true,
    required: false,
  })
  @Expose()
  suggestionImageId?: string | null;

  @ApiPropertyOptional({ description: 'Volledig suggestion image object' })
  @Expose()
  suggestionImage?: {
    id: string;
    pexelsId: string;
    displayUrl: string;
    source: string;
    photographer: string;
    sourcePageUrl: string;
  } | null;
}

export class CardListResponseDto {
  @ApiProperty({
    type: [CardResponseDto],
    description: 'Lijst van kaarten',
  })
  @Expose()
  cards: CardResponseDto[];
}
