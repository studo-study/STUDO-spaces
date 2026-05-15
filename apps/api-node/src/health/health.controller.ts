import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('health')
@ApiBearerAuth()
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Check of de api-node draait.' })
  @ApiResponse({
    status: 200,
    description: 'checken of de api-node draait',
    example: 'pong',
  })
  @Get('ping')
  ping(): string {
    return 'pong';
  }
}
