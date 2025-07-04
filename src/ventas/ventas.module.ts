import { forwardRef, Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { CrearVentaService } from './crear-venta.service';
import { BoletosModule } from '../boletos/boletos.module';
import { ConfiguracionAsientosModule } from '../configuracion-asientos/configuracion-asientos.module';
import { PagosModule } from '../pagos/pagos.module';

@Module({
  imports: [DrizzleModule, BoletosModule, ConfiguracionAsientosModule, forwardRef(() => PagosModule)],
  controllers: [VentasController],
  providers: [VentasService, CrearVentaService],
  exports: [VentasService],
})
export class VentasModule {} 