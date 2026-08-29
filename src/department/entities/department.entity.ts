import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { LocalizedName } from '../../common/localized-name.type';
@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  name: LocalizedName;

  @CreateDateColumn({ type: 'timestamp', default: null })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: null })
  updatedAt: Date;

}
