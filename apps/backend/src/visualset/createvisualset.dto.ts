import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVisualsetWithFilesDto {
  @ApiProperty({ example: 'the human body' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Biology' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'folder123' })
  @IsString()
  folder_id: string;

  @ApiProperty({
    type: 'string',
    description: 'JSON string van images metadata (zonder URLs)',
  })
  @IsString()
  images_metadata: string;

  @ApiProperty({
    type: 'string',
    description: 'JSON string van pins data',
  })
  @IsString()
  pins_data: string;
  
}

export interface ImageMetadata {
  title: string;
  index: number;
  grid_x: number;
  grid_y: number;
  scale: string;
}