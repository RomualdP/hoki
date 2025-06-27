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
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSkillDto, UpdateSkillDto, QuerySkillsDto } from './dto';

@Controller('skills')
@UseGuards(JwtAuthGuard)
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async findAll(@Query() query: QuerySkillsDto) {
    return await this.skillsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.skillsService.findOne(id);
  }

  @Post()
  async create(@Body() createSkillDto: CreateSkillDto) {
    return await this.skillsService.create(createSkillDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    return await this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.skillsService.remove(id);
  }
}
