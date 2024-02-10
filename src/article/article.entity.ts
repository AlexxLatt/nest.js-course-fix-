import { UserEntity } from '@app/user/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'articles' })
export class ArticaleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // типа (timestamp) это время (default: () => 'CURRENT_TIMESTAMP') это текущее время
  createAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // типа (timestamp) это время (default: () => 'CURRENT_TIMESTAMP') это текущее время
  updatedAt: Date;

  @Column('simple-array') // массив строк
  tagList: string[];

  @Column({ default: 0 })
  favoritesCount: number;

  @Column({ default: '' })
  comments: string;

  @BeforeUpdate() // нужно для обновления  updatedAt
  updateTimestamp() {
    this.updatedAt = new Date();
  }
  @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true })
  author: UserEntity;
}
