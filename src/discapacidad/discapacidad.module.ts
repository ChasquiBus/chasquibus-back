import { Module } from '@nestjs/common';
import { DiscapacidadService } from './discapacidad.service';
import { DiscapacidadController } from './discapacidad.controller';

@Module({
  controllers: [DiscapacidadController],
  providers: [DiscapacidadService],
})
export class DiscapacidadModule {}
