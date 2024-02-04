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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @Column({ select: false }) //возращает объект users без поля password
  password: string;

  @BeforeInsert() // вызов функции до того как будет сделана запись в базу
  async hashPassword() {
    this.password = await hash(this.password, 10); // хешируем строку password благодаря npm пакету bcrypt
  }

  @OneToMany(() => ArticaleEntity, (article) => article.author) // отношение 1 ко многим
  articles: ArticaleEntity[]; // user может делать несколь ArticaleEntity (статьи)

  @ManyToMany(() => ArticaleEntity)
  @JoinTable()
  favorites: ArticaleEntity[];
}
