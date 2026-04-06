import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'nestjs-swagger-dto';
import { IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { SessionPinResponseDTO, updateSessionPinDTO } from './sessionpin.dto';
import {
  SessionCardResponseDTO,
  updateSessionCardDTO,
} from './sessioncard.dto';
import { CardResponseDto } from '../studyset/card.dto';
import { PinResponseDto } from '../pin/pin.dto';

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
  started_at?: string;

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
  duration_min?: number;

  @ApiProperty({
    description: 'Voorlaatste login',
    example: '2024-01-15T09:00:00.000Z',
    required: false,
  })
  @IsString({
    name: 'second_last_login',
    optional: true,
  })
  second_last_login?: string;

  @ApiProperty({
    description: 'Laatste login',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsString({
    name: 'last_login',
    optional: true,
  })
  last_login?: string;

  @ApiProperty({
    description: 'Eindtijd van de sessie',
    example: '2024-01-15T11:15:00.000Z',
    required: false,
  })
  @IsString({
    name: 'ended_at',
    optional: true,
  })
  ended_at?: string;

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
  average_response_time?: number;

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
  longest_focus_streak?: number;

  @ApiProperty({
    description: 'Laatst bestudeerd',
    example: '2024-01-15T11:15:00.000Z',
    required: false,
  })
  @IsString({
    name: 'last_studied',
    optional: true,
  })
  last_studied?: string;

  @ApiProperty({
    description: 'UUID van de gebruiker',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  @IsString({
    name: 'user_id',
  })
  user_id: string;

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
  last_seen?: string;

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
  started_at: string;

  @ApiProperty({
    description: 'Duur in minuten',
    example: 45,
  })
  duration_min: number;

  @ApiProperty({
    description: 'Eindtijd',
    example: '2024-01-15T11:15:00.000Z',
  })
  ended_at: string;

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
  average_response_time: number;

  @ApiProperty({
    description: 'Langste focus streak',
    example: 10,
  })
  longest_focus_streak: number;

  @ApiProperty({
    description: 'Laatst gezien item',
    example: 'card_123',
  })
  last_seen: string;

  @ApiProperty({
    description: 'Laatst bestudeerd',
    example: '2024-01-15T11:15:00.000Z',
  })
  last_studied: string;

  @ApiProperty({
    description: 'UUID van de gebruiker',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  user_id: string;

  @ApiProperty({
    description: 'UUID van de set',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  set_id: string;

  @ApiProperty({
    description: 'Type van de set',
    example: 'flashcard',
  })
  set_type: string;
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
  started_at: string;

  @ApiProperty({
    description: 'Duur in minuten',
    example: 45,
  })
  duration_min: number;

  @ApiProperty({
    description: 'Eindtijd',
    example: '2024-01-15T11:15:00.000Z',
  })
  ended_at: string;

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
  average_response_time: number;

  @ApiProperty({
    description: 'Langste focus streak',
    example: 10,
  })
  longest_focus_streak: number;

  @ApiProperty({
    description: 'Laatst gezien item',
    example: 'card_123',
  })
  last_seen: string;

  @ApiProperty({
    description: 'Laatst bestudeerd',
    example: '2024-01-15T11:15:00.000Z',
  })
  last_studied: string;

  @ApiProperty({
    description: 'UUID van de gebruiker',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  user_id: string;

  @ApiProperty({
    description: 'UUID van de set',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  set_id: string;

  @ApiProperty({
    description: 'Type van de set',
    example: 'flashcard',
  })
  set_type: string;

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
  device_type: string;

  @ApiProperty({
    description: 'Voorlaatste login',
    example: '2024-01-15T09:00:00.000Z',
  })
  second_last_login: string;

  @ApiProperty({
    description: 'Laatste login',
    example: '2024-01-15T10:30:00.000Z',
  })
  last_login: string;
}
