import { Inject, Injectable } from '@nestjs/common';
import { PaypalService } from './pagos.paypal.service';
import { DepositoService } from './pagos.deposito.service';
import { EstadoPago } from '../ventas/dto/ventas.enum';
import { ventas } from '../drizzle/schema/ventas';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { Database } from 'drizzle/database';
import { eq } from 'drizzle-orm';

@Injectable()
export class PagosService {
  constructor(
    private paypalService: PaypalService,
    private depositoService: DepositoService,
    @Inject(DRIZZLE) private readonly db: Database
  ) {}

  async procesarPago(venta, metodoPago) {
    if (metodoPago.procesador === 'paypal') {
      return this.paypalService.iniciarPago(venta);
    } else if (metodoPago.procesador === 'deposito') {
      return this.depositoService.generarInstrucciones(venta);
    } else {
      throw new Error('Método de pago no soportado');
    }
  }

  async actualizarEstado(ventaId: number, estado: EstadoPago, comprobanteUrl?: string) {
    // Aquí usarías Drizzle para actualizar el estado
    await this.db.update(ventas)
      .set({
        estadoPago: estado,
        comprobanteUrl: comprobanteUrl || null
      })
      .where(eq(ventas.id, ventaId));
  }
}
