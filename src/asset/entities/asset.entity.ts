import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne } from 'typeorm';
import { AssetType } from '../../asset-type/entities/asset-type.entity';

@Entity('assets')
export class Asset {

  @PrimaryGeneratedColumn()
  id: number;


  @Column({ type: 'int', nullable: false })
  assetTypeId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;


  @CreateDateColumn({ type: 'timestamp', default: null  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: null  })
  updatedAt: Date;


  @ManyToOne( type => AssetType, assetType => assetType.assets)
  assetType: AssetType;
}
