import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'nestjs-swagger-dto';
import { Expose } from 'class-transformer';

export class ImageImportResponseDTO {
  @ApiProperty({
    example: 'img123',
    description: 'ID van de image',
  })
  @IsString({
    name: 'id',
    maxLength: 64,
  })
  id: string;

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
    example: 'Heart',
    description: 'term',
  })
  @Expose()
  term: string;

  @ApiProperty({
    example: 'Organ in the body',
    description: 'definition',
  })
  @Expose()
  definition: string;

  @ApiProperty({
    example: 'img link',
    description: 'https://link.com/image.png',
  })
  @Expose()
  image: string;

  @ApiProperty({
    example: 'Checkt of term nog voorkomt in lijst',
    description: 'https://link.com/image.png',
  })
  @Expose()
  isDouble: boolean;

  @ApiProperty({
    example: 'text',
    description: 'content type van de content',
  })
  @Expose()
  special_content_type: 'text' | 'latex' | 'code';
}
