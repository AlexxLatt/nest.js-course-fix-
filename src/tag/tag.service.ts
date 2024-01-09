import { Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity) //даем права на использование класса TegEntity в классе TagService
    private readonly tagRepository: Repository<TagEntity>, // Даем this конструктуру tagRepository с  классом TagEntity
  ) {}
  async findAll(): Promise<TagEntity[]> {
    //Из-за того что мы используем async (всегда при запросах)
    //то у нас возращается промисы и мы написали что бы возвращался Promise типа TagEntity[] столбца
    return await this.tagRepository.find(); // метод find найдет все данные из калонки tags указаной в файле tag.entity.ts и вернет все данные в ней
  }
}
