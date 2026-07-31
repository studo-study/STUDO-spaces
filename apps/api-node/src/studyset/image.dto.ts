import { Optional } from '@nestjs/common';
import { IsString } from 'nestjs-swagger-dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TermSuggestionDTO {
  term: string;

  @Optional()
  lang?: string;
}

export class SetCardImageDto {
  @ApiProperty({ example: 'abc123', description: 'ID van de suggestion image' })
  @IsString({ name: 'image_id', maxLength: 64 })
  @IsNotEmpty()
  imageId: string;
}

export class SuggestionImagesResponse {
  images: SuggestionImage[];
}

export class SuggestionImage {
  id: string;
  pexelsId: string;
  displayUrl: string;
  source: string;
  photographer: string;
  sourcePageUrl: string;
}
