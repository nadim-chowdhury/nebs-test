import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health Check / Hello World' })
  @ApiResponse({ status: 200, description: 'Returns a greeting string.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
