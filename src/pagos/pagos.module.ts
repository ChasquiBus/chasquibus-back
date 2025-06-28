import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { DepositoService } from './pagos.deposito.service';
import { PaypalService } from './pagos.paypal.service';

@Module({
  controllers: [PagosController],
  providers: [PagosService, PaypalService, DepositoService],
})
export class PagosModule {}
