import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApprovedState, Class, FileType, Subject } from '../types';

@Entity()
export class WorkEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column('text')
  class: Class;

  @Column('int', { default: 0 })
  timesRead: number;

  @Column()
  isMaturitaProject: boolean;

  @Column('text')
  fileType: FileType;

  @Column('text', { default: '{}', array: true })
  keywords: string[];

  @Column({ default: 'pending' })
  approvedState: ApprovedState;

  @Column({ default: '' })
  guarantorEmail: string;

  @Column('text', { default: '' })
  guarantorMessage: string;

  @Column({ default: false })
  deleted: boolean;
}
