import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetTypeService } from './asset-type.service';
import { AssetTypeController } from './asset-type.controller';
import { AssetType } from './entities/asset-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssetType])],
  controllers: [AssetTypeController],
  providers: [AssetTypeService],
})
export class AssetTypeModule {}
