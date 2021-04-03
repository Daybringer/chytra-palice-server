import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  authorName: string;
  @Column('bigint')
  dateAdded: number;
  @Column()
  workID: number;
  @Column('text')
  message: string;
}
