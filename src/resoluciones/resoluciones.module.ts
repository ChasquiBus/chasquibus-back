import { Module } from '@nestjs/common';
import { ResolucionesService } from './resoluciones.service';
import { ResolucionesController } from './resoluciones.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [ResolucionesController],
  providers: [ResolucionesService],
  exports: [ResolucionesService],
})
export class ResolucionesModule {}
