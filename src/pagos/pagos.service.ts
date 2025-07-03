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
import { VentasService } from '../ventas/ventas.service';

@Injectable()
export class PagosService {
  constructor(
    private paypalService: PaypalService,
    private depositoService: DepositoService,
    private metodosPagoService: MetodosPagoService,
    @Inject(DRIZZLE) private readonly db: Database,
    private ventasService: VentasService
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

  async procesarWebhook({ headers, body }: { headers: any, body: any }) {
    // Validar evento y extraer referencia de venta
    // (omitimos validación de firma en desarrollo)
    const eventType = body.event_type;
    let externalReference: string | null = null;
    // Buscar la referencia en el body (puede variar según el tipo de evento)
    if (body.resource && body.resource.custom_id) {
      externalReference = body.resource.custom_id;
    } else if (body.resource && body.resource.invoice_id) {
      externalReference = body.resource.invoice_id;
    } else if (body.resource && body.resource.supplementary_data && body.resource.supplementary_data.related_ids && body.resource.supplementary_data.related_ids.order_id) {
      externalReference = body.resource.supplementary_data.related_ids.order_id;
    }
    // Extraer ventaId de la referencia (asumiendo formato 'PAYPAL-<ventaId>-timestamp')
    let ventaId: number | null = null;
    if (externalReference && typeof externalReference === 'string' && externalReference.startsWith('PAYPAL-')) {
      const parts = externalReference.split('-');
      ventaId = parseInt(parts[1], 10);
    } else if (body.ventaId) {
      ventaId = parseInt(body.ventaId, 10);
    }
    // Procesar solo si es evento de pago aprobado/completado
    if (
      [
        'CHECKOUT.ORDER.APPROVED',
        'PAYMENT.CAPTURE.COMPLETED',
        'CHECKOUT.ORDER.COMPLETED'
      ].includes(eventType) && ventaId !== null
    ) {
      await this.updatearEstadoVentaPagado(ventaId);
      return { ok: true, ventaId, evento: eventType, mensaje: 'Venta marcada como pagada' };
    }
    return { ok: true, mensaje: 'Evento recibido pero no relevante para actualizar venta', eventType };
  }

  async updatearEstadoVentaPagado(ventaId: number) {
    // Usa el método de ventas.service para actualizar el estado
    if (this.ventasService && this.ventasService.updateEstadoPago) {
      await this.ventasService.updateEstadoPago(ventaId, EstadoPago.APROBADO);
    }
  }
}
