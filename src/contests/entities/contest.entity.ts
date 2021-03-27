import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../types';

@Entity()
export class ContestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('bigint')
  dateEnding: number;

  @Column('bigint')
  dateAdded: number;

  @Column({ default: true })
  running: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column()
  category: Category;

  @Column({ default: '', type: 'text' })
  description: string;

  @Column('int', { default: '{}', array: true })
  nominated: number[];

  @Column('int', { default: '{}', array: true })
  first: number[];

  @Column('int', { default: '{}', array: true })
  second: number[];

  @Column('int', { default: '{}', array: true })
  third: number[];
}
