import { Test, TestingModule } from '@nestjs/testing';
import { WorksController } from './works.controller';
import { WorksService } from './works.service';

describe('WorksController', () => {
  let controller: WorksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorksController],
      providers: [WorksService],
    }).compile();

    controller = module.get<WorksController>(WorksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
