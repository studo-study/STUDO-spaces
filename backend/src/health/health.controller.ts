import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('health')
@ApiBearerAuth()
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Check of de backend draait.' })
  @ApiResponse({
    status: 200,
    description: 'checken of de backend draait',
    example: 'pong',
  })
  @Get('ping')
  ping(): string {
    return 'pong';
  }
}
