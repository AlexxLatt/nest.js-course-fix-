import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Put,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@app/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { User } from '@app/decorators/user.decorator';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { query } from 'express';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';
import { CreateArticleCommentDto } from './dto/createArticleComment.dto';
import { ArticaleEntity } from './article.entity';

@Controller('articles')
export class ArticaleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get(':slug/comments')
  @UseGuards(AuthGuard)
  async getComment(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<string | Comment[]> {
    return await this.articleService.getComment(slug);
  }

  @Post(':slug/comments')
  @UseGuards(AuthGuard)
  async createComment(
    @Body('comments') createArticleCommentDto: CreateArticleCommentDto,
    @Param('slug') slug: string,
  ): Promise<ArticaleEntity> {
    return await this.articleService.createComment(
      slug,
      createArticleCommentDto,
    );
  }

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query('') query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.getFeed(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticalResponse(article);
  }

  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const singleArticle = await this.articleService.findArticaleBySlug(slug);
    return this.articleService.buildArticalResponse(singleArticle);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return await this.articleService.deleteArticle(slug, currentUserId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const updateArticle = await this.articleService.updateArticle(
      createArticleDto,
      slug,
      currentUserId,
    );
    return await this.articleService.buildArticalResponse(updateArticle);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleToFavorites(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticalResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async DeleteArticleFromFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.deleteArticleFromFavorites(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticalResponse(article);
  }
}
