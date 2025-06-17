import { Module } from '@nestjs/common';
import { TarifasParadasService } from './tarifas-paradas.service';
import { TarifasParadasController } from './tarifas-paradas.controller';

@Module({
  controllers: [TarifasParadasController],
  providers: [TarifasParadasService],
})
export class TarifasParadasModule {}
