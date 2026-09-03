import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>
  ) {}
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create(createDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find();
  }

  async findOne(id: number): Promise<Department | null> {
    return await this.departmentRepository.findOne({
      where: { id: id }
    });
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const  department =  await this.departmentRepository.findOne({ 
      where: {id: id} 
    });

    if(!department){
      throw new NotFoundException(`this department with id => ${id} not found `);
    }

    this.departmentRepository.merge(department, updateDepartmentDto)
    return this.departmentRepository.save(department);
  }

  async remove(id: number) {
    const department = await this.departmentRepository.findOne({
      where: { id: id }
    });


    if(!department){
      throw new NotFoundException(`this department with id => ${id} not found `);
    }
   
    // this.departmentRepository.delete(id); // => 
    return this.departmentRepository.remove(department);
    
  }
}
