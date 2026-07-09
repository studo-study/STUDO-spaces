import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'nestjs-swagger-dto';
import { IsUUID } from 'class-validator';
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
    name: 'started_at',
    optional: true,
  })
  startedAt?: string;

  @ApiProperty({
    description: 'Duur in minuten',
    example: 45,
    required: false,
  })
  @IsNumber({
    name: 'duration_min',
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
    name: 'second_last_login',
    optional: true,
  })
  secondLastLogin?: string;

  @ApiProperty({
    description: 'Laatste login',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsString({
    name: 'last_login',
    optional: true,
  })
  lastLogin?: string;

  @ApiProperty({
    description: 'Eindtijd van de sessie',
    example: '2024-01-15T11:15:00.000Z',
    required: false,
  })
  @IsString({
    name: 'ended_at',
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
    name: 'index',
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
    name: 'accuracy',
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
    name: 'average_response_time',
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
    name: 'longest_focus_streak',
    type: 'integer',
    optional: true,
  })
  longestFocusStreak?: number;

  @ApiProperty({
    description: 'Laatst bestudeerd',
    example: '2024-01-15T11:15:00.000Z',
    required: false,
  })
  @IsString({
    name: 'last_studied',
    optional: true,
  })
  lastStudied?: string;

  @ApiProperty({
    description: 'UUID van de gebruiker',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  @IsString({
    name: 'user_id',
  })
  userId: string;

  @ApiProperty({
    description: 'Laatst gezien item',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    required: false,
  })
  @IsUUID()
  @IsString({
    name: 'last_seen',
    optional: true,
  })
  lastSeen?: string;

  @ApiProperty({
    description: 'Lijst van session cards',
    type: [updateSessionCardDTO],
    required: false,
  })
  cards?: updateSessionCardDTO[];

  @ApiProperty({
    description: 'Lijst van session pins',
    type: [updateSessionPinDTO],
    required: false,
  })
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
