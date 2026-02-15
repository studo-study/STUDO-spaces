import { IsString, IsNumber } from 'nestjs-swagger-dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserRequestDto {
  @ApiProperty({
    example: 'charles@example.com',
    description: 'Email of the user',
  })
  @IsString({
    name: 'email',
    maxLength: 255,
    isEmail: true,
  })
  email: string;

  @ApiProperty({
    example: 'MyStrongPassword123',
    description: 'Password of the user',
  })
  @IsString({
    name: 'password',
    minLength: 8,
    maxLength: 128,
  })
  password: string;

  @ApiProperty({
    example: 'Charles',
    description: 'Display name of the user',
  })
  @IsString({
    name: 'displayName',
    minLength: 2,
    maxLength: 100,
  })
  displayName: string;

  @ApiProperty({
    example: 'user',
    description: 'Role of the user',
  })
  @IsString({
    name: 'role',
    minLength: 2,
    maxLength: 7,
  })
  role: string;
}

export class SocialLoginDto {
  @ApiProperty({ example: 'charles@example.com' })
  email: string;

  @ApiProperty({ example: 'Charles Degraeuwe' })
  displayName: string;

  @ApiProperty({ example: 'microsoft' })
  provider: string;

  @ApiProperty({ example: '12345-abc', required: false })
  providerId?: string;

  @ApiProperty({ example: 'https://...', required: false })
  img_url?: string;
}

export class UpdateUserDTO {
  @ApiProperty({
    example: 'newmail@example.com',
    description: 'Updated email',
    required: false,
  })
  @IsString({ name: 'email', maxLength: 255, isEmail: true, optional: true })
  email?: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'Updated password',
    required: false,
  })
  @IsString({
    name: 'password',
    optional: true,
    minLength: 8,
  })
  password?: string;

  @ApiProperty({
    example: 'New Charles',
    description: 'Updated display name',
    required: false,
  })
  @IsString({
    name: 'displayName',
    minLength: 2,
    maxLength: 100,
    optional: true,
  })
  displayName?: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Updated profile picture URL',
    required: false,
  })
  @IsString({
    name: 'img_url',
    optional: true,
    maxLength: 200,
  })
  img_url?: string;

  @ApiProperty({
    example: '2024-01-01',
    required: false,
  })
  @IsString({
    name: 'streak_started',
    optional: true,
  })
  streak_started?: string;

  @ApiProperty({
    example: 5,
    required: false,
  })
  @IsNumber({
    name: 'streak_count',
    min: 1,
    max: 10000,
    format: 'int32',
    type: 'integer',
    optional: true,
  })
  streak_count?: number;

  @ApiProperty({
    example: '2024-01-03',
    required: false,
  })
  @IsString({
    name: 'streak_last_update',
    optional: true,
  })
  streak_last_update?: string;

  @ApiProperty({
    example: '2024-01-05T14:30:00.000Z',
    required: false,
  })
  @IsString({
    name: 'last_login',
    optional: true,
  })
  last_login?: string;

  @ApiProperty({
    example: 'admin',
    required: false,
  })
  @IsString({
    name: 'role',
    minLength: 2,
    maxLength: 7,
    optional: true,
  })
  role?: string;
}

// ---------------------------------------------------------

export class UserResponseDto {
  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'ID of the user',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'charles@test.com',
    description: 'Email of the user',
  })
  @Expose()
  email: string;

  passwordHash: string;

  @ApiProperty({
    example: 'Charles',
    description: 'Display name of the user',
  })
  @Expose()
  displayName: string;

  @ApiProperty({
    example:
      'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg',
    description: 'URL of profile picture',
  })
  @Expose()
  img_url: string;

  @ApiProperty({
    example: '2011-10-05T14:48:00.000Z',
    description: 'Join date',
  })
  @Expose()
  join_date: string;

  @ApiProperty({
    example: 1,
    description: 'Join number of the user',
  })
  @Expose()
  joinNumber: number;

  @ApiProperty({
    example: 3,
    description: 'Total studygroup sets',
  })
  @Expose()
  totalSets: number;

  @ApiProperty({
    example: '2024-01-01T14:00:00.000Z',
    description: 'When the streak started',
    nullable: true,
  })
  streak_started: string | null;

  @ApiProperty({
    example: 7,
    description: 'Amount of days in a streak',
    nullable: true,
  })
  @Expose()
  streak_count: number | null;

  @ApiProperty({
    example: '2024-01-10',
    nullable: true,
  })
  @Expose()
  streak_last_update: string | null;

  @ApiProperty({
    example: '2024-01-10T15:00:00.000Z',
  })
  last_login: string;

  @ApiProperty({
    example: ['user'],
  })
  roles: string[];

  @ApiProperty({
    example: 'user',
  })
  @Expose()
  publicRole: string;

  @ApiProperty({
    example: true,
  })
  @Expose()
  verified: boolean;
}

// ---------------------------------------------------------

export class LastStudiedDto {
  @ApiProperty({ example: 'set123' })
  @Expose()
  set_id: string;

  @ApiProperty({ example: '2024-01-10T12:00:00.000Z' })
  @Expose()
  last_studied: string;

  @ApiProperty({ example: 'Biology Chapter 1' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'Biology' })
  @Expose()
  Course: string;

  @ApiProperty({ example: 'flashcards' })
  @Expose()
  type: string;

  @ApiProperty({ example: 80 })
  @Expose()
  progress: number;

  @ApiProperty({ example: 40 })
  @Expose()
  length: number;
}

export class TotalStatsDto {
  @ApiProperty({ example: 10 })
  @Expose()
  totalsets: number;

  @ApiProperty({ example: 1800 })
  @Expose()
  timeLearned: number;

  @ApiProperty({ example: 300 })
  @Expose()
  cardsLearned: number;
}

// ---------------------------------------------------------

export class UserResponseStatsDto extends UserResponseDto {
  @ApiProperty({
    type: TotalStatsDto,
    description: 'Statistics object',
  })
  @Expose()
  stats: TotalStatsDto;

  @ApiProperty({
    type: [LastStudiedDto],
    description: 'Recently studied sets',
  })
  @Expose()
  lastTen: LastStudiedDto[];
}

// ---------------------------------------------------------

export class UserListResponseDto {
  @ApiProperty({
    type: [UserResponseDto],
    description: 'List of users',
  })
  @Expose()
  users: UserResponseDto[];
}

// ---------------------------------------------------------

export class HeaderResposneDto {
  @ApiProperty({ example: 'Charles' })
  @Expose()
  displayName: string;

  @ApiProperty({ example: 'charles@test.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: 5, nullable: true })
  @Expose()
  streak_count: number | null;

  @ApiProperty({ example: 'https://example.com/pfp.png' })
  @Expose()
  pfp: string;
}

// ---------------------------------------------------------

export class ClassActivitiesDto {
  @ApiProperty({ example: 'activity123' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'classroom123' })
  @Expose()
  classroom_id: string;

  @ApiProperty({ example: 'user123' })
  @Expose()
  user_id: string;

  @ApiProperty({ example: 'Charles' })
  @Expose()
  displayName: string;

  @ApiProperty({ example: 'https://example.com/avatar.png' })
  @Expose()
  img_url: string;

  @ApiProperty({ example: 'set123' })
  @Expose()
  set_id: string;

  @ApiProperty({ example: 'flashcard' })
  @Expose()
  set_type: string;

  @ApiProperty({ example: 'Biology - Cells' })
  @Expose()
  title: string;

  @ApiProperty({ example: '2024-01-10T10:00:00.000Z' })
  @Expose()
  last_seen: string;
}

export class StartPagina {
  @ApiProperty({
    type: [LastStudiedDto],
    description: 'Recently studied sets',
  })
  @Expose()
  lastTen: LastStudiedDto[];

  @ApiProperty({
    type: [String],
    example: ['Biology', 'Math'],
  })
  @Expose()
  courses: string[];

  @ApiProperty({
    type: [ClassActivitiesDto],
    description: 'Classroom activities',
  })
  @Expose()
  class: ClassActivitiesDto[];
}
