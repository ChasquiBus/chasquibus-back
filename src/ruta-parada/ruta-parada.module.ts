import { Module } from '@nestjs/common';
import { RutaParadaService } from './ruta-parada.service';
import { RutaParadaController } from './ruta-parada.controller';

@Module({
  controllers: [RutaParadaController],
  providers: [RutaParadaService],
  exports: [RutaParadaService],
})
export class RutaParadaModule {} 