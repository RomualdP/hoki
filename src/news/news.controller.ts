import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('news')
@UseGuards(JwtAuthGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return await this.newsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.newsService.findOne(id);
  }

  @Post()
  async create(@Body() createNewsDto: any) {
    return await this.newsService.create(createNewsDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNewsDto: any) {
    return await this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.newsService.remove(id);
  }
}
