import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from '../config/database.config';
import { DepartmentModule } from '../department/department.module';
import { PositionModule } from '../position/position.module';
import { AssetTypeModule } from '../asset-type/asset-type.module';
import { AssetModule } from '../asset/asset.module';
import { UserModule } from '../user/user.module';

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
    DepartmentModule, PositionModule, AssetTypeModule, AssetModule, UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
