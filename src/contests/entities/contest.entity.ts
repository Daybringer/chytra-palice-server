import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../types';

@Entity()
export class ContestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dateEnding: number;

  @Column('bigint')
  dateAdded: number;

  @Column({ default: true })
  running: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column()
  category: Category;

  @Column({ type: 'text' })
  description: string;

  @Column('int', { array: true })
  nominated: number[];

  @Column('int', { array: true })
  first: number[];

  @Column('int', { array: true })
  second: number[];

  @Column('int', { array: true })
  third: number[];
}
