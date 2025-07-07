import { forwardRef, Module } from '@nestjs/common';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { PaypalService } from './pagos.paypal.service';
import { DepositoService } from './pagos.deposito.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { MetodosPagoModule } from '../metodos-pago/metodos-pago.module';
import { VentasModule } from 'ventas/ventas.module';

@Module({
  imports: [DrizzleModule, MetodosPagoModule, forwardRef(() => VentasModule)],
  controllers: [PagosController],
  providers: [PagosService, PaypalService, DepositoService],
  exports: [PagosService, PaypalService, DepositoService],
})
export class PagosModule {}
