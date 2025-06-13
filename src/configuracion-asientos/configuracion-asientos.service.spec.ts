import { Test, TestingModule } from '@nestjs/testing';
import { ConfiguracionAsientosService } from './configuracion-asientos.service';

describe('ConfiguracionAsientosService', () => {
  let service: ConfiguracionAsientosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfiguracionAsientosService],
    }).compile();

    service = module.get<ConfiguracionAsientosService>(ConfiguracionAsientosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
