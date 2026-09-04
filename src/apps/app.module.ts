import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from '../config/database.config';
import { DepartmentModule } from '../department/department.module';
import { PostionModule } from '../postion/postion.module';
import { AssetTypeModule } from '../asset-type/asset-type.module';
import { AssetModule } from '../asset/asset.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow<TypeOrmModuleOptions>('database'),
    }),
    DepartmentModule, PostionModule, AssetTypeModule, AssetModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
