import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AssetTypeService } from './asset-type.service';
import { CreateAssetTypeDto } from './dto/create-asset-type.dto';
import { UpdateAssetTypeDto } from './dto/update-asset-type.dto';
import { AssetType } from './entities/asset-type.entity';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('asset-types')
export class AssetTypeController {
  constructor(private readonly assetTypeService: AssetTypeService) {}

  @Post()
  @ResponseMessage('AssetType created successfully')
  create(@Body() createAssetTypeDto: CreateAssetTypeDto): Promise<AssetType> {
    return this.assetTypeService.create(createAssetTypeDto);
  } 

  @Get()
  @ResponseMessage('AssetTypes retrieved successfully')
  findAll(): Promise<AssetType[]> {
    return this.assetTypeService.findAll();
  }

  @Get(':id')
  @ResponseMessage('AssetType retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.assetTypeService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('AssetType updated successfully')
  update(@Param('id') id: string, @Body() updateAssetTypeDto: UpdateAssetTypeDto) {
    return this.assetTypeService.update(+id, updateAssetTypeDto);
  }

  @Delete(':id')
  @ResponseMessage('AssetType deleted successfully')
  remove(@Param('id') id: string) {
    return this.assetTypeService.remove(+id);
  }
}
