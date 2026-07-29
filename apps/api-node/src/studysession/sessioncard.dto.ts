import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber } from 'nestjs-swagger-dto';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class updateSessionCardDTO {
  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de kaart',
  })
  @IsString({ maxLength: 64 })
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Nummer van de kaart in de sessie',
  })
  @IsNumber({ optional: true })
  number?: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'Aantal keer bekeken in deze sessie',
  })
  @IsNumber({ optional: true })
  cardViewcount?: number;

  @ApiPropertyOptional({
    example: 15,
    description: 'Totaal aantal keer bekeken',
  })
  @IsNumber({ optional: true })
  cardTotalViewcount?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Of de kaart in de wachtrij staat',
  })
  @IsBoolean()
  @IsOptional()
  inQueue?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Of de kaart beheerst is',
  })
  @IsBoolean()
  @IsOptional()
  mastered?: boolean;

  @ApiPropertyOptional({
    example: 2,
    description: 'Aantal keer opnieuw geleerd',
  })
  @IsNumber({ optional: true })
  timesRelearned?: number;

  @ApiPropertyOptional({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de sessie',
  })
  @IsString({ maxLength: 64, optional: true })
  sessionId?: string;

  @ApiPropertyOptional({
    example: '2f1cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de eigenaar',
  })
  @IsString({ maxLength: 64, optional: true })
  ownerId?: string;
}

export class SessionCardResponseDTO {
  @ApiProperty({
    example: '3a2cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de sessioncard',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 1,
    description: 'Nummer van de kaart in de sessie',
  })
  @Expose()
  number: number;

  @ApiProperty({
    example: 3,
    description: 'Aantal keer bekeken in deze sessie',
  })
  @Expose()
  cardViewcount: number;

  @ApiProperty({
    example: 15,
    description: 'Totaal aantal keer bekeken',
  })
  @Expose()
  cardTotalViewcount: number;

  @ApiProperty({
    example: true,
    description: 'Of de kaart in de wachtrij staat',
  })
  @Expose()
  inQueue: boolean;

  @ApiProperty({
    example: false,
    description: 'Of de kaart beheerst is',
  })
  @Expose()
  mastered: boolean;

  @ApiProperty({
    example: 2,
    description: 'Aantal keer opnieuw geleerd',
  })
  @Expose()
  timesRelearned: number;

  @ApiProperty({
    example: '4b3cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de card',
  })
  @Expose()
  cardId: string;

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
}
