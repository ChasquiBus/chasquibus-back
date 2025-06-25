import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { CrearVentaService } from './crear-venta.service';

@Module({
  imports: [DrizzleModule],
  controllers: [VentasController],
  providers: [VentasService, CrearVentaService],
  exports: [VentasService],
})
export class VentasModule {} 