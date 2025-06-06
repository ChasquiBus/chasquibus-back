import { Module } from '@nestjs/common';
import { ConfiguracionAsientosService } from './configuracion-asientos.service';
import { ConfiguracionAsientosController } from './configuracion-asientos.controller';

@Module({
  controllers: [ConfiguracionAsientosController],
  providers: [ConfiguracionAsientosService],
})
export class ConfiguracionAsientosModule {}
