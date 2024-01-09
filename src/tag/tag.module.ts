import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])], // я добавил import тк у нас используется TagEntity
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
