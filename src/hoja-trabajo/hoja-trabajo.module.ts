import { Module } from '@nestjs/common';
import { HojaTrabajoService } from './hoja-trabajo.service';
import { HojaTrabajoController } from './hoja-trabajo.controller';

@Module({
  controllers: [HojaTrabajoController],
  providers: [HojaTrabajoService],
  exports: [HojaTrabajoService],
})
export class HojaTrabajoModule {} 