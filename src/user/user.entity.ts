import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { ArticaleEntity } from '@app/article/article.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn() // id прибавляет +1
  id: number;

  @Column() // email
  email: string;

  @Column() // username
  username: string;

  @Column({ default: '' }) //bio { default: '' } - означает,что можно не заполнять
  bio: string;

  @Column({ default: '' }) //image { default: '' } - означает,что можно не заполнять
  image: string;

  @Column({ select: false }) //возращает объект users без поля password
  password: string;

  @BeforeInsert() // вызов функции до того как будет сделана запись в базу
  async hashPassword() {
    this.password = await hash(this.password, 10); // хешируем строку password благодаря npm пакету bcrypt
  }

  @OneToMany(() => ArticaleEntity, (article) => article.author) // отношение 1 ко многим
  articles: ArticaleEntity[]; // user может делать несколь ArticaleEntity (статьи)

  @ManyToMany(() => ArticaleEntity) // отношение много ко многим
  @JoinTable() // создаем таблицу
  favorites: ArticaleEntity[];
}
