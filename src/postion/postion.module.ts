import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostionService } from './postion.service';
import { PostionController } from './postion.controller';
import { Postion } from './entities/postion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Postion])],
  controllers: [PostionController],
  providers: [PostionService],
})
export class PostionModule {}
