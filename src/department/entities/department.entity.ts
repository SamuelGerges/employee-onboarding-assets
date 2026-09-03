import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
// import type { LocalizedName } from '../../common/localized-name.type';
import { Postion } from '../../postion/entities/postion.entity';
@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn({ type: 'timestamp', default: null })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: null })
  updatedAt: Date;


  @OneToMany(type => Postion, postion => postion.department, { cascade: true })
  postions: Postion[];

}
