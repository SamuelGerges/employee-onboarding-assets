import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @ResponseMessage('Position created successfully')
  async create(@Body() createPositionDto: CreatePositionDto) {
    return await this.positionService.create(createPositionDto);
  }

  @Get()
  @ResponseMessage('Position retrieved successfully')
  async findAll() {
    return await this.positionService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Position retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.positionService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('Position updated successfully')
  update(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto) {
    return this.positionService.update(+id, updatePositionDto);
  }

  @Delete(':id')
  @ResponseMessage('Position deleted successfully')
  remove(@Param('id') id: string) {
    return this.positionService.remove(+id);
  }
}
