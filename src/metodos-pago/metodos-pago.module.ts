import { Module } from '@nestjs/common';
import { MetodosPagoService } from './metodos-pago.service';
import { MetodosPagoController } from './metodos-pago.controller';
import { DrizzleModule } from 'drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [MetodosPagoController],
  providers: [MetodosPagoService],
})
export class MetodosPagoModule {}
