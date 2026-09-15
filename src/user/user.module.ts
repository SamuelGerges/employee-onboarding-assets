import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { PasswordService } from './password.service';
import { Department } from '../department/entities/department.entity';
import { Position } from '../position/entities/position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Department, Position])],
  controllers: [UserController],
  providers: [UserService, PasswordService],
})
export class UserModule {}
