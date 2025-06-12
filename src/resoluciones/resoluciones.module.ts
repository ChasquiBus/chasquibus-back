import { Module } from '@nestjs/common';
import { ResolucionesService } from './resoluciones.service';
import { ResolucionesController } from './resoluciones.controller';

@Module({
  controllers: [ResolucionesController],
  providers: [ResolucionesService],
})
export class ResolucionesModule {}
