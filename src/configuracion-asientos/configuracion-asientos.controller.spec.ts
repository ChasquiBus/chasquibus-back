import { Test, TestingModule } from '@nestjs/testing';
import { ConfiguracionAsientosController } from './configuracion-asientos.controller';

describe('ConfiguracionAsientosController', () => {
  let controller: ConfiguracionAsientosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfiguracionAsientosController],
    }).compile();

    controller = module.get<ConfiguracionAsientosController>(ConfiguracionAsientosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
