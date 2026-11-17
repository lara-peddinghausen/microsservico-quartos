import { Test, TestingModule } from '@nestjs/testing';
import { TiposQuartoService } from './tipos-quarto.service';

describe('TiposQuartoService', () => {
  let service: TiposQuartoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiposQuartoService],
    }).compile();

    service = module.get<TiposQuartoService>(TiposQuartoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
