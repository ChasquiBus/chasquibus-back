import { Module } from '@nestjs/common';
import { HojaTrabajoService } from './hoja-trabajo.service';
import { HojaTrabajoController } from './hoja-trabajo.controller';
import { CrearHojaTrabajoService } from './crear-hoja-trabajo.service';

@Module({
  controllers: [HojaTrabajoController],
  providers: [HojaTrabajoService, CrearHojaTrabajoService],
  exports: [HojaTrabajoService],
})
export class HojaTrabajoModule {} 