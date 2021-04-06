import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column('bigint')
  dateAdded: number;

  @Column('text')
  content: string;

  @Column('text', { default: '{}', array: true })
  pictures: string[];

  @Column({ default: false })
  deleted: boolean;
}
