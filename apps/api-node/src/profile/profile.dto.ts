import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'nestjs-swagger-dto';
import { Type } from 'class-transformer';
import { StudysetResponseDto } from '../studyset/studyset.dto';
import { VisualsetResponseDto } from '../visualset/visualset.dto';
import {
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

export class ProfileDto {
  @ApiProperty({
    description: 'Unieke user ID (bijv. Clerk ID)',
    example: 'user_2x9f8d3jK9pQ5mN7vL',
    maxLength: 64,
  })
  @IsString({ maxLength: 64 })
  userId: string;

  @ApiProperty({
    description: 'Weergavenaam van de gebruiker',
    example: 'SuperStudent123',
    maxLength: 100,
  })
  @IsString({ maxLength: 100 })
  displayName: string;

  @ApiProperty({
    description: 'URL naar profielfoto',
    example: 'https://img.clerk.dev/abc123.jpg',
    maxLength: 120,
  })
  @IsString({ maxLength: 120 })
  imgUrl: string;

  @ApiProperty({
    description: 'URL naar banner (optioneel)',
    example: 'https://example.com/banner.jpg',
    maxLength: 120,
    nullable: true,
    required: false,
  })
  @IsString({ maxLength: 120 })
  @IsOptional()
  bannerUrl: string | null;

  @ApiProperty({
    description: 'Datum + tijd van aanmelding (ISO string)',
    example: '2025-01-15T14:22:18Z',
    maxLength: 24,
  })
  @IsString({ maxLength: 24 })
  joinDate: string;

  @ApiProperty({
    description: 'Uniek volgnummer bij registratie',
    example: 15423,
  })
  @IsInt()
  @Min(1)
  joinNumber: number;

  @ApiProperty({
    description: 'Huidige dagelijkse streak',
    example: 42,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  streak: number;

  @ApiProperty({
    description: 'Of het account geverifieerd is',
    example: true,
  })
  @IsBoolean()
  verified: boolean;
}

export class ProfileListResponseDto {
  @ApiProperty({
    description: 'Lijst van profielen (bijv. leaderboard of zoekresultaten)',
    type: [ProfileDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfileDto)
  profiles: ProfileDto[];
}

export class ClassroomProfileDto {
  @ApiProperty({ example: '3U3IJJdkd2x9f8d3jK9pQ5mN7vL', maxLength: 64 })
  @IsString({ maxLength: 64 })
  userId: string;

  @ApiProperty({ example: 'Jan', maxLength: 100 })
  @IsString({ maxLength: 100 })
  displayName: string;

  @ApiProperty({ example: 'https://img.clerk.dev/xyz123.jpg', maxLength: 120 })
  @IsString({ maxLength: 120 })
  imgUrl: string;
}

export class ClassroomProfileListDto {
  @ApiProperty({
    description: 'Lichte profielen voor classroom overzicht',
    type: [ClassroomProfileDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClassroomProfileDto)
  profiles: ClassroomProfileDto[];
}

export class ProfileResponseDto {
  @ApiProperty({ type: ProfileDto })
  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;

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
