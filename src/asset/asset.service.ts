import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { AssetType } from '../asset-type/entities/asset-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssetService {

  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>, 
    @InjectRepository(AssetType)
    private readonly assetTypeRepository: Repository<AssetType>
  ) {
  }

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const assetType = await this.assetTypeRepository.findOne({ where: { id: createAssetDto.assetTypeId } });
    if(!assetType) {
      throw new NotFoundException(`AssetType with id ${createAssetDto.assetTypeId} not found`); 
    }

    const asset = this.assetRepository.create(createAssetDto);
    return await this.assetRepository.save(asset);
  }

  async findAll(): Promise<Asset[]> {
    return await this.assetRepository.find({ relations: { assetType: true } });
  }

  async findOne(id: number): Promise<Asset> {
    const asset = await this.assetRepository.findOne({ 
      where: { id },
      relations: { assetType: true }
    });
    if (!asset) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }
    return asset;
  }

  async update(id: number, updateAssetDto: UpdateAssetDto): Promise<Asset> {
    
    const asset = await this.assetRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }

    const assetType = await this.assetTypeRepository.findOne({ where: { id: updateAssetDto.assetTypeId } });

    if(!assetType) {
      throw new NotFoundException(`AssetType with id ${updateAssetDto.assetTypeId} not found`); 
    }


    this.assetRepository.merge(asset, updateAssetDto);
    return await this.assetRepository.save(asset);
  }

  async remove(id: number): Promise<Asset> {
    const asset = await this.assetRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    } 
    return await this.assetRepository.remove(asset);
  }
}
