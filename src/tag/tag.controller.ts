import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get() // Сдесь я убрал async findAll(): string[] тк у нас в функции findAll в tag.service.ts возвращается  Promise<TagEntity[]>
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagService.findAll(); // взяли и поместили в пременную нащ объект <TagEntity[]>
    return { tags: tags.map((tag) => tag.name) }; // возвращаем объект где tags является объектом с масивом имен tag
  }
}
