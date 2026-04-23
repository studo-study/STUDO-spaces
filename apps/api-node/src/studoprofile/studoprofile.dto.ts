import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsString, IsOptional, ValidateNested } from 'class-validator';
import { StudysetResponseDto } from '../studyset/studyset.dto';
import { VisualsetResponseDto } from '../visualset/visualset.dto';

export class StudoProfileDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsString()
  img_url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner_url?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

export class TrackDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  trackName: string;

  @ApiProperty()
  @IsString()
  icon_name: string;

  @ApiProperty()
  @IsString()
  grade: string;

  @ApiProperty({ type: [StudysetResponseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudysetResponseDto)
  studysets: StudysetResponseDto[];

  @ApiProperty({ type: [VisualsetResponseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VisualsetResponseDto)
  visualsets: VisualsetResponseDto[];
}

export class CommunityDTO {
  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de classroom',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Advanced Biology 2024',
    description: 'Naam van de classroom',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Prof. Johnson',
    description: 'Naam van de eigenaar',
  })
  @Expose()
  owner: string;

  @ApiProperty({
    example: '2f1cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de eigenaar',
  })
  @Expose()
  owner_id: string;

  @ApiProperty({
    example: 'classroom',
    description: 'Type van het zoekresultaat',
  })
  @Expose()
  type: string;

  @ApiProperty({
    example: true,
    description: 'Of de classroom geverifieerd is',
  })
  @Expose()
  verified: boolean;
}

export class StudoProfileResponseDTO {
  @ApiProperty({ type: StudoProfileDTO })
  @ValidateNested()
  @Type(() => StudoProfileDTO)
  profile: StudoProfileDTO;

  @ApiProperty({ type: [TrackDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackDTO)
  tracks: TrackDTO[];

  @ApiProperty({ type: [CommunityDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommunityDTO)
  communities: CommunityDTO[];
}
