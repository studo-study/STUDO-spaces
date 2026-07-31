import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVisualsetWithFilesDto {
  @ApiProperty({ example: 'the human body' })
  @IsString()
  title: string;

  @ApiProperty({
    type: 'string',
    description: 'JSON string van images metadata (zonder URLs)',
  })
  @IsString()
  imagesMetadata: string;

  @ApiProperty({
    type: 'string',
    description: 'JSON string van pins data',
  })
  @IsString()
  pinsData: string;
}

export interface ImageMetadata {
  title: string;
  index: number;
  gridX: number;
  gridY: number;
  scale: string;
}
