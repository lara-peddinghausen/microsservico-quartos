import { Test, TestingModule } from '@nestjs/testing';
import { TiposQuartoController } from './tipos-quarto.controller';

describe('TiposQuartoController', () => {
  let controller: TiposQuartoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposQuartoController],
    }).compile();

    controller = module.get<TiposQuartoController>(TiposQuartoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
