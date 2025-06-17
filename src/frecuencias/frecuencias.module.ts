import { Module } from '@nestjs/common';

import { FrecuenciasController } from './frecuencias.controller';
import { CooperativasModule } from 'cooperativas/cooperativas.module';
import { FrecuenciasService } from './frecuencias.service';

@Module({
  imports: [CooperativasModule],
  controllers: [FrecuenciasController],
  providers: [FrecuenciasService],
  exports: [FrecuenciasService],
})
export class FrecuenciasModule {} 