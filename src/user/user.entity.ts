import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcrypt';

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
}
