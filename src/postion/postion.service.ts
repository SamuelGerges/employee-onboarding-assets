import { Injectable } from '@nestjs/common';
import { CreatePostionDto } from './dto/create-postion.dto';
import { UpdatePostionDto } from './dto/update-postion.dto';
import { Postion } from './entities/postion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostionService {
  constructor(
    @InjectRepository(Postion)
    private readonly postionRepository: Repository<Postion>
  ) {}

  async create(createPostionDto: CreatePostionDto) {
    const postion =  this.postionRepository.create(createPostionDto);
    return  await this.postionRepository.save(postion);
  }

  async findAll() {
    return this.postionRepository.find(
      {
        relations: { department: true }
      }
    );
  }

  async findOne(id: number) {
    return this.postionRepository.findOne({
      where: { id: id },
      relations: { department: true }
    });
  }

  async update(id: number, updatePostionDto: UpdatePostionDto) {
    const postion = await this.postionRepository.findOne({
      where: { id: id }
    })

    if(!postion){
      throw new Error(`this postion with id => ${id} not found `);
    }

    this.postionRepository.merge(postion, updatePostionDto)
    return this.postionRepository.save(postion);
  }

  async remove(id: number) {
     const postion = await this.postionRepository.findOne({
      where: { id: id }
    })

    if(!postion){
      throw new Error(`this postion with id => ${id} not found `);
    }
    return this.postionRepository.remove(postion);
  }
}
