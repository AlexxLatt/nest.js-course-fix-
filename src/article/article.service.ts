import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticaleEntity } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { DeleteResult, getRepository } from 'typeorm';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { FollowEntity } from '@app/profile/follow.entity';
import { CreateArticleCommentDto } from './dto/createArticleComment.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticaleEntity)
    private readonly articleRepository: Repository<ArticaleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async findAll(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = getRepository(ArticaleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.addOrderBy('articles.createAt', 'DESC'); // сортировка постов по времени

    const articlesCount = await queryBuilder.getCount();

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        username: query.author,
      });
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne(
        { username: query.favorited },
        { relations: ['favorites'] },
      );
      if (author && author.favorites.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...favoriteIds)', {
          favoriteIds: author.favorites.map((el) => el.id),
        });
      } else {
        queryBuilder.andWhere('1=0'); // Нет избранных для указанного пользователя
      }
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[] = [];
    if (currentUserId) {
      const currentUser = await this.userRepository.findOne(currentUserId, {
        relations: ['favorites'],
      });
      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany();
    const articleWithFavorites = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });
    return { articles: articleWithFavorites, articlesCount };
  }

  async getFeed(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepository.find({
      followerId: currentUserId,
    }); // вернет массив follows где мы зафоловили статью
    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }

    const followsUserIds = follows.map((follow) => follow.followingId);
    const queryBuilder = getRepository(ArticaleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followsUserIds });

    queryBuilder.orderBy('articles.createAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticaleEntity> {
    const article = new ArticaleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }
    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser; //typeorm записывает из-за связи только authorId
    return await this.articleRepository.save(article);
  }

  async getComment(slug: string) {
    const article = await this.findArticaleBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (!article.comments) {
      article.comments = 'пока тут ничего нету!';
    }
    return article.comments;
  }

  async createComment(
    slug: string,
    createArticleComment: CreateArticleCommentDto,
  ) {
    const mainArticle = await this.findArticaleBySlug(slug);

    mainArticle.comments = createArticleComment.comments;
    return await this.articleRepository.save(mainArticle);
  }

  async addArticleToFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticaleEntity> {
    const article = await this.findArticaleBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites'],
    });
    const isNotFavotited =
      user.favorites.findIndex(
        (articleInFavotites) => articleInFavotites.id === article.id,
      ) === -1;
    if (isNotFavotited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }

  async deleteArticleFromFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticaleEntity> {
    const article = await this.findArticaleBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites'],
    });
    const articleIndex = user.favorites.findIndex(
      (articleInFavotites) => articleInFavotites.id === article.id,
    );
    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }

  buildArticalResponse(article: ArticaleEntity): ArticleResponseInterface {
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  async findArticaleBySlug(slug): Promise<ArticaleEntity> {
    return await this.articleRepository.findOne({ slug });
  }

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findArticaleBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    createArticleDto: CreateArticleDto,
    slug: string,
    currentUserId: number,
  ): Promise<ArticaleEntity> {
    const newArticle = await this.findArticaleBySlug(slug);
    if (!newArticle) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (newArticle.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    Object.assign(newArticle, createArticleDto);
    return await this.articleRepository.save(newArticle);
  }
}
