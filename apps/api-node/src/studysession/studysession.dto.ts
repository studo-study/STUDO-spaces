import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'nestjs-swagger-dto';
import { IsUUID, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SessionPinResponseDTO, updateSessionPinDTO } from './sessionpin.dto';
import {
  SessionCardResponseDTO,
  updateSessionCardDTO,
} from './sessioncard.dto';

export class UpdateStudysessionDto {
  @ApiProperty({
    description: 'Starttijd van de sessie',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsString({
    optional: true,
  })
  startedAt?: string;

  @ApiProperty({
    description: 'Duur in minuten',
    example: 45,
    required: false,
  })
  @IsNumber({
    type: 'integer',
    optional: true,
  })
  durationMin?: number;

  @ApiProperty({
    description: 'Voorlaatste login',
    example: '2024-01-15T09:00:00.000Z',
    required: false,
  })
  @IsString({
    optional: true,
  })
  secondLastLogin?: string;

  @ApiProperty({
    description: 'Laatste login',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsString({
    optional: true,
  })
  lastLogin?: string;

  @ApiProperty({
    description: 'Eindtijd van de sessie',
    example: '2024-01-15T11:15:00.000Z',
    required: false,
  })
  @IsString({
    optional: true,
  })
  endedAt?: string;

  @ApiProperty({
    description: 'Index in de set',
    example: 5,
    minimum: 0,
    required: false,
  })
  @Type(() => Number)
  @IsNumber({
    type: 'integer',
    min: 0,
    optional: true,
  })
  index?: number;

  @ApiProperty({
    description: 'Nauwkeurigheid percentage',
    example: 85,
    required: false,
  })
  @IsNumber({
    type: 'integer',
    optional: true,
  })
  accuracy?: number;

  @ApiProperty({
    description: 'Gemiddelde reactietijd',
    example: 2500,
    required: false,
  })
  @IsNumber({
    type: 'integer',
    optional: true,
  })
  averageResponseTime?: number;

  @ApiProperty({
    description: 'Langste focus streak',
    example: 10,
    required: false,
  })
  @IsNumber({
    type: 'integer',
    optional: true,
  })
  longestFocusStreak?: number;

  @ApiProperty({
    description: 'Cumulatief aantal beurten',
    example: 120,
    required: false,
  })
  @IsNumber({
    type: 'integer',
    optional: true,
  })
  totalAttempts?: number;

  @ApiProperty({
    description: 'Cumulatief aantal juiste beurten',
    example: 95,
    required: false,
  })
  @IsNumber({
    type: 'integer',
    optional: true,
  })
  totalCorrect?: number;

  @ApiProperty({
    description: 'Laatst bestudeerd',
    example: '2024-01-15T11:15:00.000Z',
    required: false,
  })
  @IsString({
    optional: true,
  })
  lastStudied?: string;

  @ApiProperty({
    description: 'UUID van de gebruiker',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    description: 'Laatst gezien item',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  @IsString({
    optional: true,
  })
  lastSeen?: string;

  @ApiProperty({
    description: 'Lijst van session cards',
    type: [updateSessionCardDTO],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => updateSessionCardDTO)
  cards?: updateSessionCardDTO[];

  @ApiProperty({
    description: 'Lijst van session pins',
    type: [updateSessionPinDTO],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => updateSessionPinDTO)
  pins?: updateSessionPinDTO[];
}

export class StudysessionDTO {
  @ApiProperty({
    description: 'UUID van de sessie',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Starttijd',
    example: '2024-01-15T10:30:00.000Z',
  })
  startedAt: string;

  @ApiProperty({
    description: 'Duur in minuten',
    example: 45,
  })
  durationMin: number;

  @ApiProperty({
    description: 'Eindtijd',
    example: '2024-01-15T11:15:00.000Z',
  })
  endedAt: string;

  @ApiProperty({
    description: 'Index in de set',
    example: 5,
  })
  index: number;

  @ApiProperty({
    description: 'Nauwkeurigheid percentage',
    example: 85,
  })
  accuracy: number;

  @ApiProperty({
    description: 'Gemiddelde reactietijd',
    example: 2500,
  })
  averageResponseTime: number;

  @ApiProperty({
    description: 'Langste focus streak',
    example: 10,
  })
  longestFocusStreak: number;

  @ApiProperty({
    description: 'Cumulatief aantal beurten',
    example: 120,
  })
  totalAttempts: number;

  @ApiProperty({
    description: 'Cumulatief aantal juiste beurten',
    example: 95,
  })
  totalCorrect: number;

  @ApiProperty({
    description: 'Laatst gezien item',
    example: 'card_123',
  })
  lastSeen: string;

  @ApiProperty({
    description: 'Laatst bestudeerd',
    example: '2024-01-15T11:15:00.000Z',
  })
  lastStudied: string;

  @ApiProperty({
    description: 'UUID van de gebruiker',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'UUID van de set',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  setId: string;

  @ApiProperty({
    description: 'Type van de set',
    example: 'flashcard',
  })
  setType: string;
}

export class StudysessionResponseDto {
  @ApiProperty({
    description: 'UUID van de sessie',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Starttijd',
    example: '2024-01-15T10:30:00.000Z',
  })
  startedAt: string;

  @ApiProperty({
    description: 'Duur in minuten',
    example: 45,
  })
  durationMin: number;

  @ApiProperty({
    description: 'Eindtijd',
    example: '2024-01-15T11:15:00.000Z',
  })
  endedAt: string;

  @ApiProperty({
    description: 'Index in de set',
    example: 5,
  })
  index: number;

  @ApiProperty({
    description: 'Nauwkeurigheid percentage',
    example: 85,
  })
  accuracy: number;

  @ApiProperty({
    description: 'Gemiddelde reactietijd',
    example: 2500,
  })
  averageResponseTime: number;

  @ApiProperty({
    description: 'Langste focus streak',
    example: 10,
  })
  longestFocusStreak: number;

  @ApiProperty({
    description: 'Cumulatief aantal beurten',
    example: 120,
  })
  totalAttempts: number;

  @ApiProperty({
    description: 'Cumulatief aantal juiste beurten',
    example: 95,
  })
  totalCorrect: number;

  @ApiProperty({
    description: 'Laatst gezien item',
    example: 'card_123',
  })
  lastSeen: string;

  @ApiProperty({
    description: 'Laatst bestudeerd',
    example: '2024-01-15T11:15:00.000Z',
  })
  lastStudied: string;

  @ApiProperty({
    description: 'UUID van de gebruiker',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'UUID van de set',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  setId: string;

  @ApiProperty({
    description: 'Type van de set',
    example: 'flashcard',
  })
  setType: string;

  @ApiProperty({
    description: 'Lijst van session pins',
    type: [SessionPinResponseDTO],
    nullable: true,
  })
  pins: SessionPinResponseDTO[] | null;

  @ApiProperty({
    description: 'Lijst van session cards',
    type: [SessionCardResponseDTO],
    nullable: true,
  })
  cards: SessionCardResponseDTO[] | null;
}

export class StudysessionListResponseDto {
  @ApiProperty({
    description: 'Lijst van alle sessies',
    type: [StudysessionResponseDto],
  })
  sessions: StudysessionResponseDto[];
}

export class TotalStats {
  @ApiProperty({
    description: 'Totaal aantal sets',
    example: 10,
  })
  totalsets: number;

  @ApiProperty({
    description: 'Totale leertijd in minuten',
    example: 1800,
  })
  timeLearned: number;

  @ApiProperty({
    description: 'Totaal aantal geleerde kaarten',
    example: 300,
  })
  cardsLearned: number;

  @ApiProperty({
    description: 'Totaal aantal geleerde kaarten',
    example: 300,
  })
  totalCards: number;
}

export class UserStats {
  @ApiProperty({
    description: 'Type apparaat',
    example: 'desktop',
  })
  deviceType: string;

  @ApiProperty({
    description: 'Voorlaatste login',
    example: '2024-01-15T09:00:00.000Z',
  })
  secondLastLogin: string;

  @ApiProperty({
    description: 'Laatste login',
    example: '2024-01-15T10:30:00.000Z',
  })
  lastLogin: string;
}
