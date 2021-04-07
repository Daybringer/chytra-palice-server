import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TileEntity {
  @PrimaryColumn()
  type: string;

  @Column('text')
  content: string;
}
