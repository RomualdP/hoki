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
    const result = await this.usersService.findAll(query);
    return {
      success: true,
      data: result.data,
      meta: result.meta,
      message: 'Utilisateurs récupérés avec succès',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      success: true,
      data: user,
      message: 'Utilisateur récupéré avec succès',
    };
  }

  @Get(':id/profile')
  async getProfile(@Param('id') id: string) {
    const profile = await this.usersService.getProfile(id);
    return {
      success: true,
      data: profile,
      message: 'Profil récupéré avec succès',
    };
  }

  @Put(':id/profile')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.usersService.updateProfile(id, updateProfileDto);
    return {
      success: true,
      data: profile,
      message: 'Profil mis à jour avec succès',
    };
  }

  @Get(':id/skills')
  async getUserSkills(@Param('id') id: string) {
    const skills = await this.usersService.getUserSkills(id);
    return {
      success: true,
      data: skills,
      message: 'Compétences récupérées avec succès',
    };
  }

  @Post(':id/skills')
  async addSkill(@Param('id') id: string, @Body() skillData: AddSkillDto) {
    const skill = await this.usersService.addSkill(id, skillData);
    return {
      success: true,
      data: skill,
      message: 'Compétence ajoutée avec succès',
    };
  }

  @Put(':id/skills/:skillId')
  async updateSkill(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
    @Body() skillData: UpdateSkillDto,
  ) {
    const skill = await this.usersService.updateSkill(id, skillId, skillData);
    return {
      success: true,
      data: skill,
      message: 'Compétence mise à jour avec succès',
    };
  }

  @Delete(':id/skills/:skillId')
  async removeSkill(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
  ) {
    await this.usersService.removeSkill(id, skillId);
    return {
      success: true,
      message: 'Compétence supprimée avec succès',
    };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      data: user,
      message: 'Utilisateur créé avec succès',
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      success: true,
      data: user,
      message: 'Utilisateur mis à jour avec succès',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return {
      success: true,
      message: 'Utilisateur supprimé avec succès',
    };
  }
}
