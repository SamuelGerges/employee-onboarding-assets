import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostionService } from './postion.service';
import { CreatePostionDto } from './dto/create-postion.dto';
import { UpdatePostionDto } from './dto/update-postion.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('postions')
export class PostionController {
  constructor(private readonly postionService: PostionService) {}

  @Post()
  @ResponseMessage('Position created successfully')
  async create(@Body() createPostionDto: CreatePostionDto) {
    return await this.postionService.create(createPostionDto);
  }

  @Get()
  @ResponseMessage('Position retrieved successfully')
  async findAll() {
    return await this.postionService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Position retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.postionService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('Position updated successfully')
  update(@Param('id') id: string, @Body() updatePostionDto: UpdatePostionDto) {
    return this.postionService.update(+id, updatePostionDto);
  }

  @Delete(':id')
  @ResponseMessage('Position deleted successfully')
  remove(@Param('id') id: string) {
    return this.postionService.remove(+id);
  }
}
