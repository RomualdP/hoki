import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'volley-app-backend',
    };
  }

  @Post('test-cors')
  testCors(@Body() data: Record<string, unknown>) {
    return {
      success: true,
      message: 'CORS fonctionne !',
      receivedData: data,
      timestamp: new Date().toISOString(),
    };
  }
}
