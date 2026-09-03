import { Test, TestingModule } from '@nestjs/testing';
import { PostionService } from './postion.service';

describe('PostionService', () => {
  let service: PostionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostionService],
    }).compile();

    service = module.get<PostionService>(PostionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
