import { Test, TestingModule } from '@nestjs/testing';
import { PostionController } from './postion.controller';
import { PostionService } from './postion.service';

describe('PostionController', () => {
  let controller: PostionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostionController],
      providers: [PostionService],
    }).compile();

    controller = module.get<PostionController>(PostionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
