import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaypalService } from './pagos.paypal.service';
import { DepositoService } from './pagos.deposito.service';
import { EstadoPago } from '../ventas/dto/ventas.enum';
import { ventas } from '../drizzle/schema/ventas';
import { metodosPago } from '../drizzle/schema/metodos-pago';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { Database } from '../drizzle/database';
import { eq } from 'drizzle-orm';
import { MetodosPagoService } from '../metodos-pago/metodos-pago.service';

@Injectable()
export class PagosService {
  constructor(
    private paypalService: PaypalService,
    private depositoService: DepositoService,
    private metodosPagoService: MetodosPagoService,
    @Inject(DRIZZLE) private readonly db: Database
  ) {}

  /**
   * Procesar pago después de crear una venta
   */
  async procesarPago(ventaId: number, metodoPagoId: number) {
    // Obtener la venta
    const [venta] = await this.db
      .select()
      .from(ventas)
      .where(eq(ventas.id, ventaId))
      .limit(1);

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${ventaId} no encontrada`);
    }

    // Obtener el método de pago
    const [metodoPago] = await this.db
      .select()
      .from(metodosPago)
      .where(eq(metodosPago.id, metodoPagoId))
      .limit(1);

    if (!metodoPago) {
      throw new NotFoundException(`Método de pago con ID ${metodoPagoId} no encontrado`);
    }

    if (!metodoPago.activo) {
      throw new BadRequestException('El método de pago no está activo');
    }

    // Procesar según el tipo de método de pago
    if (metodoPago.procesador === 'paypal') {
      return this.paypalService.iniciarPago(venta, metodoPago);
    } else if (metodoPago.procesador === 'deposito') {
      return this.depositoService.generarInstrucciones(venta, metodoPago);
    } else {
      throw new BadRequestException('Método de pago no soportado');
    }
  }

  /**
   * Actualizar estado de pago
   */
  async actualizarEstado(ventaId: number, estado: EstadoPago, comprobanteUrl?: string | null) {
    const [venta] = await this.db
      .select()
      .from(ventas)
      .where(eq(ventas.id, ventaId))
      .limit(1);

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${ventaId} no encontrada`);
    }

    await this.db.update(ventas)
      .set({
        estadoPago: estado,
        comprobanteUrl: comprobanteUrl || null,
        updatedAt: new Date()
      })
      .where(eq(ventas.id, ventaId));

    return { 
      mensaje: `Estado de pago actualizado a ${estado}`,
      ventaId,
      estado 
    };
  }


  /**
   * Rechazar pago
   */
  async rechazarPago(ventaId: number, motivo?: string) {
    return this.actualizarEstado(ventaId, EstadoPago.RECHAZADO);
  }

  /**
   * Cancelar pago
   */
  async cancelarPago(ventaId: number) {
    return this.actualizarEstado(ventaId, EstadoPago.CANCELADO);
  }
}
