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
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateProfileDto,
  QueryUsersDto,
  AddSkillDto,
  UpdateSkillDto,
} from './dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/profile')
  async getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Put(':id/profile')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(id, updateProfileDto);
  }

  @Get(':id/statistics')
  async getStatistics(@Param('id') id: string) {
    return this.usersService.getStatistics(id);
  }

  @Get(':id/achievements')
  async getAchievements(@Param('id') id: string) {
    return this.usersService.getAchievements(id);
  }

  @Get(':id/skills')
  async getUserSkills(@Param('id') id: string) {
    return this.usersService.getUserSkills(id);
  }

  @Post(':id/skills')
  async addSkill(@Param('id') id: string, @Body() skillData: AddSkillDto) {
    return this.usersService.addSkill(id, skillData);
  }

  @Put(':id/skills/:skillId')
  async updateSkill(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
    @Body() skillData: UpdateSkillDto,
  ) {
    return this.usersService.updateSkill(id, skillId, skillData);
  }

  @Delete(':id/skills/:skillId')
  async removeSkill(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
  ) {
    return this.usersService.removeSkill(id, skillId);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
