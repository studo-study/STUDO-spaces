import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'nestjs-swagger-dto';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateSetLikeDto {
  @ApiProperty({
    example: '2f1cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de studyset die geliked wordt',
  })
  @IsString({ name: 'set_id', maxLength: 64 })
  @IsNotEmpty()
  set_id: string;
}

export class SetLikeResponseDto {
  @ApiProperty({
    example: '3a2cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de like',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de gebruiker',
  })
  @Expose()
  user_id: string;

  @ApiProperty({
    example: '2f1cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de set',
  })
  @Expose()
  set_id: string;

  @ApiProperty({
    example: 'studyset',
    description: 'Type van de set (studyset of visualset)',
  })
  @Expose()
  set_type: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Aanmaak timestamp van de like',
  })
  @Expose()
  created_at: string;
}

export class SetLikeResponseListDto {
  @ApiProperty({
    type: [SetLikeResponseDto],
    description: 'Lijst van likes',
  })
  @Expose()
  likes: SetLikeResponseDto[];
}
