import { IsString } from 'nestjs-swagger-dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({
    example: 'newmail@example.com',
    description: 'email to log in',
    required: true,
  })
  @IsString({
    name: 'email',
    maxLength: 255,
    isEmail: true,
  })
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'password to log in',
    required: true,
  })
  @IsString({
    name: 'password',
    maxLength: 200,
  })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZjBjMDc2ZS1mMzBjLTY0YjAtYTBmMy1kNWEwMjFjNmE5Y2IiLCJlbWFpbCI6ImNoYXJsZXNAdGVzdC5jb20iLCJyb2xlcyI6WyJ1c2VyIiwiYWRtaW4iXSwiaWF0IjoxNzY0MDgyODA5LCJleHAiOjE3NjQwODY0MDksImF1ZCI6ImJ1ZGdldC5ob2dlbnQuYmUiLCJpc3MiOiJidWRnZXQuaG9nZW50LmJlIn0.6YN8pJaWF9NbO2Oi_6Vs0WT76Upt6MHq-DRgyGBFPQo',
    required: true,
  })
  @IsString({
    name: 'token',
    minLength: 1,
    maxLength: 300,
  })
  token: string;
}
