import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PasswordService } from './password.service';
import { Department } from '../department/entities/department.entity';
import { Position } from '../position/entities/position.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Department)
    private readonly departmentRepostory: Repository<Department>,

    @InjectRepository(Position)
    private readonly positionRepostory: Repository<Position>,

    private readonly passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.findByEmail(createUserDto.email);

    if (userExists) {
      throw new NotFoundException('User with this email already exists');
    }

    const department = await this.departmentRepostory.findOne({
      where: { id: createUserDto.department_id} 
    });

    if(!department){
      throw new NotFoundException('this department not fount');
    }

    const position = await this.positionRepostory.findOne({
      where: { id: createUserDto.position_id}
    });


    if(!position){
      throw new NotFoundException('this position not fount');
    }
    

    const hashedPassword = await this.passwordService.hashPassword(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }



  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
