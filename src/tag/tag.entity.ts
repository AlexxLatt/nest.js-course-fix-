//файл который дает нам таблицу tags c колонками id : number (primary key) и  name : string
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tags' })
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
