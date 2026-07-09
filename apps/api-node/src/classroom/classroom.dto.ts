import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'nestjs-swagger-dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class CreateClassroomDto {
  @ApiProperty({
    description: 'Naam van de classroom',
    example: 'Anatomie 2024-2025',
    minLength: 2,
    maxLength: 64,
  })
  @IsString({
    name: 'name',
    minLength: 2,
    maxLength: 64,
  })
  name: string;

  @ApiProperty({
    description: 'Type van de classroom',
    example: 'course',
    minLength: 1,
    maxLength: 10,
  })
  @IsString({
    name: 'type',
    minLength: 1,
    maxLength: 10,
  })
  type: string;

  @ApiProperty({
    description: 'school van de classroom',
    example: 'school',
    minLength: 1,
    maxLength: 50,
  })
  @IsString({
    name: 'school',
    minLength: 1,
    maxLength: 50,
  })
  school: string;
}

export class UpdateClassroomDto {
  @ApiProperty({
    description: 'Nieuwe naam voor de classroom',
    example: 'Anatomie 2025-2026',
    minLength: 2,
    maxLength: 255,
    required: false,
  })
  @IsString({
    name: 'name',
    minLength: 2,
    maxLength: 255,
    optional: true,
  })
  name?: string;

  @ApiProperty({
    description: 'Nieuwe eigenaar UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    minLength: 32,
    maxLength: 64,
    required: false,
  })
  @IsString({
    name: 'owner',
    minLength: 32,
    maxLength: 64,
    optional: true,
  })
  @IsUUID()
  owner?: string;

  @ApiProperty({
    description: 'Nieuw type',
    example: 'studygroup-group',
    minLength: 1,
    maxLength: 20,
    required: false,
  })
  @IsString({
    name: 'type',
    minLength: 1,
    maxLength: 20,
    optional: true,
  })
  type?: string;

  @ApiProperty({
    description: 'Update verificatie status',
    example: false,
    required: false,
  })
  @IsBoolean({
    name: 'verified',
    optional: true,
  })
  verified?: boolean;
}

export class ClassroomResponseDto {
  @ApiProperty({
    description: 'UUID van de classroom',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Naam van de classroom',
    example: 'Anatomie 2024-2025',
  })
  name: string;

  @ApiProperty({
    description: 'UUID van de eigenaar',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  ownerId: string;

  @ApiProperty({
    description: 'Type van de classroom',
    example: 'course',
  })
  type: string;

  @ApiProperty({
    description: 'Aanmaakdatum',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Verificatie status',
    example: true,
  })
  verified: boolean;

  @ApiProperty({
    description: 'School van de classroom',
    example: 'school',
  })
  school: string;
}

export class CreateClassroomSetDto {
  @ApiProperty({
    description: 'UUID van de set',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  setId: string;
}

export class CreateClassroomSetsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  sets: string[];
}

export class ClassroomSetDto {
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
    description: 'UUID van de classroom',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  classroomId: string;

  @ApiProperty({
    description: 'UUID van de toevoeger',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  addedBy: string;
}

export class FullClassroomSetDto {
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
    description: 'Titel van de set',
    example: 'biology hoofdstuk 3',
  })
  title: string;

  @ApiProperty({
    description: 'UUID van de classroom',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  classroomId: string;

  @ApiProperty({
    description: 'UUID van de eigenaar',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  owner: string;

  @ApiProperty({
    description: 'naam van de toevoeger',
    example: 'Frank De Boozere',
    format: 'uuid',
  })
  addedBy: string;

  @ApiProperty({
    description: 'Aanmaakdatum',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: string;
}

export class ClassroomUserDto {
  @ApiProperty({
    description: 'UUID van de gebruiker',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'UUID van de classroom',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  classroomId: string;

  @ApiProperty({
    description: 'profielfoto van de gebruiker',
    example: 'https://image.png',
  })
  imgUrl: string;

  @ApiProperty({
    description: 'Rol van de gebruiker',
    example: 'student',
  })
  role: string;

  @ApiProperty({
    description: 'Datum wanneer gebruiker lid werd',
    example: '2024-01-15T10:30:00.000Z',
  })
  joinedAt: string;

  @ApiProperty({
    description: 'Display naam van de gebruiker',
    example: 'Charles',
  })
  displayName: string;

  @ApiProperty({
    description: 'Streak count van de gebruiker',
    example: 7,
  })
  streak: number;

  @ApiProperty({
    description: 'Of de gebruiker geverifieerd is',
    example: true,
  })
  verified: boolean;

  @ApiProperty({
    description: 'positie van gebruiker binnen classroom',
    example: 1,
  })
  position: number;
}

export class FullClassroomResponseDto extends ClassroomResponseDto {
  @ApiProperty({
    description: 'Lijst van sets in de classroom',
    type: [FullClassroomSetDto],
  })
  sets: FullClassroomSetDto[];

  @ApiProperty({
    description: 'Lijst van gebruikers in de classroom',
    type: [ClassroomUserDto],
  })
  users: ClassroomUserDto[];
}

export class ClassroomListResponseDto {
  @ApiProperty({
    description: 'Lijst van alle classrooms',
    type: [ClassroomResponseDto],
  })
  classrooms: ClassroomResponseDto[];
}

// Classroom user
export class CreateClassroomUserDto {
  @ApiProperty({
    description: 'UUID van de classroom',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    minLength: 20,
  })
  @IsString({
    name: 'classroom_id',
    minLength: 20,
  })
  @IsUUID()
  classroomId: string;

  @ApiProperty({
    description: 'Rol van de gebruiker',
    example: 'student',
    minLength: 6,
  })
  @IsString({
    name: 'role',
    minLength: 6,
  })
  role: string;
}

export class UpdateClassroomUsersDTO {
  @ApiProperty({
    description: 'Nieuwe rol voor de gebruiker',
    example: 'teacher',
    minLength: 6,
  })
  @IsString({
    name: 'role',
    minLength: 6,
  })
  role: string;

  @ApiProperty({
    description: 'Algemene Classroom leaderboard positie',
    example: 10,
    minLength: 1,
  })
  @IsNumber({})
  position: number;
}

export class leaveClassroomDto {
  @ApiProperty({
    description: 'UUID van de classroom',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  classroomId: string;
}

export class CreateClassroomActivityDto {
  @ApiProperty({
    description: 'UUID van de toevoeger',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsString({
    name: 'user_id',
    maxLength: 64,
  })
  userId: string;

  @ApiProperty({
    description: 'UUID van de set',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsString({
    name: 'set_id',
    maxLength: 64,
  })
  setId: string;

  @ApiProperty({
    description: 'UUID van de classroom',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsString({
    name: 'classroom_id',
    maxLength: 64,
  })
  classroomId: string;
}

export class ClassroomUserResponseDto {
  @ApiProperty({
    description: 'UUID van de gebruiker',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'UUID van de classroom',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  classroomId: string;

  @ApiProperty({
    description: 'Rol van de gebruiker',
    example: 'student',
  })
  role: string;

  @ApiProperty({
    description: 'Datum wanneer gebruiker lid werd',
    example: '2024-01-15T10:30:00.000Z',
  })
  joinedAt: string;

  @ApiProperty({
    description: 'Positie van de gebruiker',
    example: 1,
  })
  position: number;
}

export class CreateChallengeDTO {
  challengeType: 'time attack' | 'mastery tournament' | 'duel';
}

export class ChallengeResponseDTO {
  challengeId: string;
  challengeType: 'time attack' | 'mastery tournament' | 'duel';
  startDate: string;
  endDate: string;
  running: boolean;
  setId: string;
  title: string;
  displayName: string;
  creatorId: string;
  classroomId: string;
}

export class ChallengeMemberDTO {
  challengeId: string;
  userId: string;
  displayName: string;
  imgUrl: string;
  classroomId: string;
  position: number;
  winner: boolean;
}
