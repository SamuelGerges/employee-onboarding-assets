import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './entities/position.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>
  ) {}

  async create(createPositionDto: CreatePositionDto) {
    const position =  this.positionRepository.create(createPositionDto);
    return  await this.positionRepository.save(position);
  }

  async findAll() {
    return this.positionRepository.find(
      {
        relations: { department: true }
      }
    );
  }

  async findOne(id: number) {
    return this.positionRepository.findOne({
      where: { id: id },
      relations: { department: true }
    });
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    const position = await this.positionRepository.findOne({
      where: { id: id }
    })

    if(!position){
      throw new Error(`this position with id => ${id} not found `);
    }

    this.positionRepository.merge(position, updatePositionDto)
    return this.positionRepository.save(position);
  }

  async remove(id: number) {
     const position = await this.positionRepository.findOne({
      where: { id: id }
    })

    if(!position){
      throw new Error(`this position with id => ${id} not found `);
    }
    return this.positionRepository.remove(position);
  }
}
