import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class KeywordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  keyword: string;

  @Column({ default: 0 })
  usedCount: number;
}
