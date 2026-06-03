import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('app')
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Start de api-node op' })
  @ApiResponse({
    status: 200,
    description: 'server is opgestart op poort 3000',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
