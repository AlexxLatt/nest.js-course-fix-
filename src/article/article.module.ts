import { Module } from '@nestjs/common';
import { ArticaleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticaleEntity } from './article.entity';
import { UserEntity } from '@app/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticaleEntity, UserEntity])],
  controllers: [ArticaleController],
  providers: [ArticleService],
})
export class ArticaleModule {}
