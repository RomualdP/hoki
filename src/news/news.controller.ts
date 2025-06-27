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

  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    return await this.newsService.getComments(id);
  }

  @Post(':id/comments')
  async addComment(@Param('id') id: string, @Body() commentData: any) {
    return await this.newsService.addComment(id, commentData);
  }

  @Put('comments/:commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() commentData: any,
  ) {
    return await this.newsService.updateComment(commentId, commentData);
  }

  @Delete('comments/:commentId')
  async removeComment(@Param('commentId') commentId: string) {
    return await this.newsService.removeComment(commentId);
  }

  @Post(':id/like')
  async likeNews(
    @Param('id') id: string,
    @Body() userData: { userId: string },
  ) {
    return await this.newsService.likeNews(id, userData.userId);
  }

  @Delete(':id/like')
  async unlikeNews(
    @Param('id') id: string,
    @Body() userData: { userId: string },
  ) {
    return await this.newsService.unlikeNews(id, userData.userId);
  }

  @Post(':id/view')
  async viewNews(
    @Param('id') id: string,
    @Body() userData: { userId: string },
  ) {
    return await this.newsService.viewNews(id, userData.userId);
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
