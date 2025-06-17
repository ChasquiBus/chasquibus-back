import { Module } from '@nestjs/common';
import { CiudadesService } from './ciudades.service';
import { CiudadesController } from './ciudades.controller';
import { ProvinciasService } from './provincias.service';

@Module({
  controllers: [CiudadesController],
  providers: [CiudadesService, ProvinciasService],
})
export class CiudadesModule {}
