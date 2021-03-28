import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApprovedState, Subject } from '../types';

@Entity()
export class WorkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  deleted: boolean;

  @Column()
  name: string;

  @Column('bigint')
  dateAdded: number;

  @Column()
  authorName: string;

  @Column()
  authorEmail: string;

  @Column()
  contestID: number;

  @Column()
  subject: Subject;

  @Column()
  isMaturitaProject: boolean;

  @Column('text', { default: '{}', array: true })
  keywords: string[];

  @Column({ default: 'pending' })
  approvedState: ApprovedState;

  @Column({ default: '' })
  guarantorEmail: string;

  @Column('text', { default: '' })
  guarantorMessage: string;
}
