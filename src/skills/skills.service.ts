import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto, UpdateSkillDto, QuerySkillsDto } from './dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QuerySkillsDto) {
    const { page = 1, limit = 10, category, isActive } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {};

    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const [skills, total] = await Promise.all([
      this.prisma.skill.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          _count: {
            select: {
              userSkills: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.skill.count({ where }),
    ]);

    return {
      data: skills,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
      include: {
        userSkills: {
          include: { user: true },
        },
      },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    return skill;
  }

  async create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: createSkillDto,
    });
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    return this.prisma.skill.update({
      where: { id },
      data: updateSkillDto,
    });
  }

  async remove(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    return this.prisma.skill.delete({ where: { id } });
  }
}
