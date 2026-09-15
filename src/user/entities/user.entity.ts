import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Department } from "../../department/entities/department.entity";
import { Position } from "../../position/entities/position.entity";
import { UserRoleEnum } from "../../common/enums/user-roles.enum";

@Entity('users')
// @Unique(['email'])
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;
  
  @Column({ type: 'varchar', length: 100, select: false })
  password: string;



  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.EMPLOYEE })
  role: UserRoleEnum;

  @Column({ type: 'int', default: null })
  manager_id: number | null;

  @Column({ type: 'int' })
  department_id: number;

  @Column({ type: 'int' })
  position_id: number;

  @Column({ type: 'boolean', default: null })
  is_active: boolean;


  @CreateDateColumn({ type: 'timestamp', default: null })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: null })
  updated_at: Date;

  @ManyToOne(type => Department, department => department.users)
  @JoinColumn({ name: 'department_id' })
  department: Department;


  @ManyToOne(type => Position, position => position.users)
  @JoinColumn({ name: 'position_id' })
  position: Position;


  @OneToMany(type => User, user => user.manager)
  directReports: User[];


  @ManyToOne(type => User, user => user.directReports, {nullable: true})
  @JoinColumn({ name: 'manager_id' })
  manager: User;

}
