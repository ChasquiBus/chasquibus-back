import { Module } from '@nestjs/common';
import { CiudadesService } from './ciudades.service';
import { CiudadesController } from './ciudades.controller';
import { ProvinciasService } from './provincias.service';
import { ProvinciasController } from './provincias.controller';

@Module({
  controllers: [CiudadesController, ProvinciasController],
  providers: [CiudadesService, ProvinciasService],
})
export class CiudadesModule {}
