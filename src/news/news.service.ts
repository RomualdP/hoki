import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  CreateNewsDto,
  UpdateNewsDto,
  QueryNewsDto,
  CreateNewsCommentDto,
  UpdateNewsCommentDto,
} from './dto';
import { NewsWhereInput, DateFilter } from '../types';

@Injectable()
export class NewsService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(query: QueryNewsDto) {
    const {
      page = 1,
      limit = 10,
      category,
      authorId,
      dateFrom,
      dateTo,
    } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: NewsWhereInput = {};

    if (category)
      where.category = category as
        | 'MATCH_RESULTS'
        | 'TOURNAMENT'
        | 'TEAM_NEWS'
        | 'PLAYER_SPOTLIGHT'
        | 'GENERAL'
        | 'ANNOUNCEMENT';
    if (authorId) where.authorId = authorId;
    if (dateFrom || dateTo) {
      const dateFilter: DateFilter = {};
      if (dateFrom) dateFilter.gte = new Date(dateFrom);
      if (dateTo) dateFilter.lte = new Date(dateTo);
      where.publishedAt = dateFilter;
    }

    const [news, total] = await Promise.all([
      this.database.news.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
              interactions: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
      }),
      this.database.news.count({ where }),
    ]);

    return {
      data: news,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findOne(id: string) {
    const news = await this.database.news.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        gallery: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          where: { parentId: null },
          orderBy: { createdAt: 'desc' },
        },
        interactions: true,
      },
    });

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return news;
  }

  async getComments(id: string) {
    return this.database.newsComment.findMany({
      where: { newsId: id, parentId: null },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addComment(newsId: string, commentData: CreateNewsCommentDto) {
    return this.database.newsComment.create({
      data: {
        newsId,
        userId: commentData.authorId,
        content: commentData.content,
        parentId: commentData.parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async updateComment(commentId: string, commentData: UpdateNewsCommentDto) {
    return this.database.newsComment.update({
      where: { id: commentId },

      data: commentData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async removeComment(commentId: string) {
    return this.database.newsComment.delete({
      where: { id: commentId },
    });
  }

  async likeNews(newsId: string, userId: string) {
    return this.database.newsInteraction.upsert({
      where: {
        newsId_userId_type: {
          newsId,
          userId,
          type: 'LIKE',
        },
      },
      update: {},
      create: {
        newsId,
        userId,
        type: 'LIKE',
      },
    });
  }

  async unlikeNews(newsId: string, userId: string) {
    return this.database.newsInteraction.delete({
      where: {
        newsId_userId_type: {
          newsId,
          userId,
          type: 'LIKE',
        },
      },
    });
  }

  async viewNews(newsId: string, userId: string) {
    return this.database.newsInteraction.upsert({
      where: {
        newsId_userId_type: {
          newsId,
          userId,
          type: 'VIEW',
        },
      },
      update: {},
      create: {
        newsId,
        userId,
        type: 'VIEW',
      },
    });
  }

  async create(createNewsDto: CreateNewsDto) {
    return this.database.news.create({
      data: createNewsDto,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    const news = await this.database.news.findUnique({ where: { id } });
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return this.database.news.update({
      where: { id },
      data: updateNewsDto,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const news = await this.database.news.findUnique({ where: { id } });
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return this.database.news.delete({ where: { id } });
  }
}
