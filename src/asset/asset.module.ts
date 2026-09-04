import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { Asset } from './entities/asset.entity';
import { AssetType } from '../asset-type/entities/asset-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, AssetType])],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
