import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetTypeDto } from './dto/create-asset-type.dto';
import { UpdateAssetTypeDto } from './dto/update-asset-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetType } from './entities/asset-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssetTypeService {

  constructor(
    @InjectRepository(AssetType) 
    private readonly assetTypeRepostory: Repository<AssetType>
  ) {}

  
  async create(createAssetTypeDto: CreateAssetTypeDto): Promise<AssetType> {
    const assetType = this.assetTypeRepostory.create(createAssetTypeDto);
    return await this.assetTypeRepostory.save(assetType);
  }


  async findAll(): Promise<AssetType[]> {
    return await this.assetTypeRepostory.find();
  }

  async findOne(id: number): Promise<AssetType | null> {
    const assetType =  this.assetTypeRepostory.findOneBy({ id });
    if(!assetType) {
      throw new NotFoundException(`AssetType with id ${id} not found`);
    }
    return await assetType;
  }

  async update(id: number, updateAssetTypeDto: UpdateAssetTypeDto): Promise<AssetType> {
    const assetType = await this.assetTypeRepostory.findOneBy({ id });

    if(!assetType) {
      throw new NotFoundException(`AssetType with id ${id} not found`);
    }

    this.assetTypeRepostory.merge(assetType, updateAssetTypeDto);
    return await this.assetTypeRepostory.save(assetType);

  }

  async remove(id: number) {
    const assetType = await this.assetTypeRepostory.findOneBy({ id });  

    if(!assetType) {
      throw new NotFoundException(`AssetType with id ${id} not found`); 
    }
    
    return await this.assetTypeRepostory.remove(assetType);
  }
}
