import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { Asset } from './entities/asset.entity';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @ResponseMessage('Asset created successfully')
  async create(@Body() createAssetDto: CreateAssetDto): Promise<Asset> {
    return this.assetService.create(createAssetDto);
  }

  @Get()
  @ResponseMessage('Assets retrieved successfully')
  async findAll(): Promise<Asset[]> {
    return this.assetService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Asset retrieved successfully')
  async findOne(@Param('id') id: string): Promise<Asset> {
    return this.assetService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('Asset updated successfully')
  async update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto): Promise<Asset> {
    return this.assetService.update(+id, updateAssetDto);
  }

  @Delete(':id')
  @ResponseMessage('Asset deleted successfully')
  async remove(@Param('id') id: string): Promise<Asset> {
    return this.assetService.remove(+id);
  }
}
