import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber } from 'nestjs-swagger-dto';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class updateSessionPinDTO {
  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de identify',
  })
  @IsString({ name: 'id', maxLength: 64 })
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Nummer van de identify in de sessie',
  })
  @IsNumber({ name: 'number' })
  @IsOptional()
  number?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Of de identify in de wachtrij staat',
  })
  @IsBoolean()
  @IsOptional()
  inQueue?: boolean;

  @ApiPropertyOptional({
    example: 5,
    description: 'Aantal keer bekeken in deze sessie',
  })
  @IsNumber({ name: 'pin_viewcount' })
  @IsOptional()
  pinViewcount?: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Totaal aantal keer bekeken',
  })
  @IsNumber({ name: 'pin_total_viewcount' })
  @IsOptional()
  pinTotalViewcount?: number;

  @ApiPropertyOptional({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de sessie',
  })
  @IsString({ name: 'session_id', maxLength: 64 })
  @IsOptional()
  sessionId?: string;

  @ApiPropertyOptional({
    example: '2f1cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de eigenaar',
  })
  @IsString({ name: 'owner_id', maxLength: 64 })
  @IsOptional()
  ownerId?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'of pin geflagged is in de sessie',
  })
  @IsBoolean()
  @IsOptional()
  flagged?: boolean;
}

export class SessionPinResponseDTO {
  @ApiProperty({
    example: '3a2cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de sessionpin',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 1,
    description: 'Nummer van de identify in de sessie',
  })
  @Expose()
  number: number;

  @ApiProperty({
    example: false,
    description: 'Of de identify beheerst is',
  })
  @Expose()
  mastered: boolean;

  @ApiProperty({
    example: 1,
    description: 'Aantal keer opnieuw geleerd',
  })
  @Expose()
  timesRelearned: number;

  @ApiProperty({
    example: true,
    description: 'Of de identify in de wachtrij staat',
  })
  @Expose()
  inQueue: boolean;

  @ApiProperty({
    example: 5,
    description: 'Aantal keer bekeken in deze sessie',
  })
  @Expose()
  pinViewcount: number;

  @ApiProperty({
    example: 20,
    description: 'Totaal aantal keer bekeken',
  })
  @Expose()
  pinTotalViewcount: number;

  @ApiProperty({
    example: '4b3cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de identify',
  })
  @Expose()
  pinId: string;

  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de sessie',
  })
  @Expose()
  sessionId: string;

  @ApiProperty({
    example: '2f1cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de eigenaar',
  })
  @Expose()
  ownerId: string;

  @ApiProperty({
    example: true,
    description: 'of pin geflagged is in de sessie',
  })
  @Expose()
  flagged: boolean;
}
