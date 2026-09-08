import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
// import type { LocalizedName } from '../../common/localized-name.type';
import { Department } from '../../department/entities/department.entity';
import { User } from '../../user/entities/user.entity';




@Entity('postions')
export class Postion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  department_id: number;

  @ManyToOne(type => Department, department => department.postions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: null })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp', default: null })
  updatedAt: Date;


  @OneToMany(type => User, user => user.position)
  users: User[];


}
