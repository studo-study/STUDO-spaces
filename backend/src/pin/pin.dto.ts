import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePinDto {
  @ApiProperty({
    description: 'De definitie/omschrijving van de identify',
    example: 'Hoofd van de humerus',
  })
  @IsString()
  @MinLength(1)
  definition: string;

  @ApiProperty({
    description: 'X-coördinaat op de afbeelding',
    example: 245.5,
  })
  @IsNumber()
  x: number;

  @ApiProperty({
    description: 'Y-coördinaat op de afbeelding',
    example: 180.0,
  })
  @IsNumber()
  y: number;

  @ApiProperty({
    description: 'Volgnummer van de identify (meestal 1, 2, 3...)',
    example: 1,
  })
  @IsInt()
  @Min(1)
  number: number;

  @ApiProperty({
    description: 'Volledige URL naar de afbeelding',
    example: 'https://example.com/images/anatomy-123.jpg',
    minLength: 5,
  })
  @IsString()
  @MinLength(5)
  img_url: string;
}

export class UpdatePinDto {
  @ApiProperty({
    description: 'UUID van de identify die je wilt updaten',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Nieuwe definitie (optioneel)',
    example: 'Trochanter major',
    required: false,
  })
  @IsString()
  @IsOptional()
  definition?: string;

  @ApiProperty({
    description: 'Nieuwe X-coördinaat',
    example: 250,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  x?: number;

  @ApiProperty({
    description: 'Nieuwe Y-coördinaat',
    example: 185,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  y?: number;

  @ApiProperty({ description: 'Nieuw volgnummer', example: 2, required: false })
  @IsInt()
  @IsOptional()
  number?: number;

  @ApiProperty({
    description: 'Update-timestamp (wordt door backend gezet)',
    example: '2025-04-05T12:34:56.789Z',
    required: false,
  })
  @IsString()
  @IsOptional()
  updated_at?: string;
}

export class PinResponseDto {
  @ApiProperty({
    description: 'UUID van de identify',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Definitie/omschrijving',
    example: 'Hoofd van de humerus',
  })
  @IsString()
  definition: string;

  @ApiProperty({ description: 'X-coördinaat', example: 245.5 })
  @IsNumber()
  x: number;

  @ApiProperty({ description: 'Y-coördinaat', example: 180.0 })
  @IsNumber()
  y: number;

  @ApiProperty({ description: 'Volgnummer', example: 1 })
  @IsInt()
  @Min(1)
  number: number;

  @ApiProperty({
    description: 'Wanneer de identify is aangemaakt',
    example: '2025-04-01T10:22:11.123Z',
  })
  @IsString()
  created_at: string;

  @ApiProperty({
    description: 'Wanneer de identify laatst is gewijzigd',
    example: '2025-04-05T12:34:56.789Z',
  })
  @IsString()
  updated_at: string;

  @ApiProperty({ description: 'ID van de afbeelding', example: 'img_123abc' })
  @IsString()
  image_id: string;

  @ApiProperty({ description: 'ID van de visualset', example: 'set_456def' })
  @IsString()
  set_id: string;

  @ApiProperty({
    description: 'User ID van de eigenaar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  owner_id: string;
}

export class PinResponseListDto {
  @ApiProperty({
    description: 'Lijst van alle pins van een visualset',
    type: [PinResponseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PinResponseDto)
  pins: PinResponseDto[];
}
