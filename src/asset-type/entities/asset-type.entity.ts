import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Asset } from '../../asset/entities/asset.entity';

@Entity('asset_types')
export class AssetType {

  @PrimaryGeneratedColumn()
  id: number;


  @Column({ type: 'varchar', length: 255  })
  name: string;


  @CreateDateColumn({ type: 'timestamp', default: null })
  createdAt: Date;


  @UpdateDateColumn({ type: 'timestamp', default: null })
  updatedAt: Date;

  @OneToMany(type => Asset, assets => assets.assetType, { cascade: true })
  assets: Asset[];
}
