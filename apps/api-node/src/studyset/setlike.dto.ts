import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'nestjs-swagger-dto';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateSetLikeDto {
  @ApiProperty({
    example: '2f1cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de studoset die geliked wordt',
  })
  @IsString({ name: 'set_id', maxLength: 64 })
  @IsNotEmpty()
  setId: string;
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
  userId: string;

  @ApiProperty({
    example: '2f1cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de set',
  })
  @Expose()
  setId: string;

  @ApiProperty({
    example: 'studyset',
    description: 'Type van de set (studoset of ((visualset)))',
  })
  @Expose()
  setType: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Aanmaak timestamp van de like',
  })
  @Expose()
  createdAt: string;
}

export class SetLikeResponseListDto {
  @ApiProperty({
    type: [SetLikeResponseDto],
    description: 'Lijst van likes',
  })
  @Expose()
  likes: SetLikeResponseDto[];
}
