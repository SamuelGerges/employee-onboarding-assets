import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
// import type { LocalizedName } from '../../common/localized-name.type';
import { Position } from '../../position/entities/position.entity';
import { User } from '../../user/entities/user.entity';
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


  @OneToMany(type => Position, position => position.department, { cascade: true })
  positions: Position[];

  @OneToMany(type => User, user => user.department)
  users: User[];
}
