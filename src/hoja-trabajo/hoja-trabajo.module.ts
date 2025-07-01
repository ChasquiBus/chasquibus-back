import { Module } from '@nestjs/common';
import { HojaTrabajoService } from './hoja-trabajo.service';
import { HojaTrabajoController } from './hoja-trabajo.controller';
import { CrearHojaTrabajoService } from './crear-hoja-trabajo.service';
import { ConfiguracionAsientosModule } from 'configuracion-asientos/configuracion-asientos.module';

@Module({
  controllers: [HojaTrabajoController],
  providers: [HojaTrabajoService, CrearHojaTrabajoService],
  exports: [HojaTrabajoService],
  imports: [ConfiguracionAsientosModule]
})
export class HojaTrabajoModule {} 