import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';
import { PaypalService } from './pagos.paypal.service';
import { EstadoPago } from '../ventas/dto/ventas.enum';
import { ventas } from '../drizzle/schema/ventas';
import { metodosPago } from '../drizzle/schema/metodos-pago';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { Database } from '../drizzle/database';
import { eq } from 'drizzle-orm';
import { VentasService } from '../ventas/ventas.service';

@Injectable()
export class PagosService {
  constructor(
    private paypalService: PaypalService,
    @Inject(DRIZZLE) private readonly db: Database,
    @Inject(forwardRef(() => VentasService))
    private readonly ventasService: VentasService,
  ) {}

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
      throw new NotFoundException(
        `Método de pago con ID ${metodoPagoId} no encontrado`,
      );
    }

    if (!metodoPago.activo) {
      throw new BadRequestException('El método de pago no está activo');
    }

    // Procesar según el tipo de método de pago
    if (metodoPago.procesador === 'paypal') {
      return this.paypalService.procesarPagoPaypal(venta, metodoPago);
    } else {
      throw new BadRequestException('Método de pago no soportado');
    }
  }

async findVentaByOrderId(orderId: string) {
  console.log('Buscando venta por orderId:', orderId);
  
  try {
    const [venta] = await this.db
      .select()
      .from(ventas)
      .where(eq(ventas.orderId, orderId))
      .limit(1);
    
    console.log('Venta encontrada por orderId:', venta);
    return venta;
  } catch (error) {
    console.error('Error al buscar venta por orderId:', error);
    throw error;
  }
}

async procesarWebhook({ headers, body }: { headers: any; body: any }) {
  console.log('=== PROCESANDO WEBHOOK DE PAYPAL ===');
  console.log('Event Type:', body.event_type);
  console.log('Resource Type:', body.resource_type);
  console.log('Body completo:', JSON.stringify(body, null, 2));

  const eventType = body.event_type;
  let orderId: string | null = null;

  // Extraer orderId según el tipo de evento
  if (body.resource) {
    console.log('Resource encontrado:', body.resource);
    
    // Para eventos de PAYMENT.CAPTURE.COMPLETED
    if (body.resource.supplementary_data?.related_ids?.order_id) {
      orderId = body.resource.supplementary_data.related_ids.order_id;
      console.log('OrderId extraído de supplementary_data:', orderId);
    }
    // Para eventos de CHECKOUT.ORDER.*
    else if (body.resource.id && body.resource_type === 'checkout-order') {
      orderId = body.resource.id;
      console.log('OrderId extraído de resource.id (checkout-order):', orderId);
    }
    // Para otros casos
    else if (body.resource.order_id) {
      orderId = body.resource.order_id;
      console.log('OrderId extraído de resource.order_id:', orderId);
    }
    // Como último recurso, usar el ID del resource si es una orden
    else if (body.resource.id) {
      orderId = body.resource.id;
      console.log('OrderId extraído de resource.id (fallback):', orderId);
    }
  }

  console.log('OrderId final extraído:', orderId);

  let ventaId: number | null = null;
  let venta: any | null = null;

  if (orderId) {
    try {
      venta = await this.findVentaByOrderId(orderId);
      console.log('Venta encontrada:', venta);
      
      if (venta) {
        ventaId = venta.id;
        console.log('VentaId asignado:', ventaId);
      } else {
        console.log('No se encontró venta para el orderId:', orderId);
      }
    } catch (error) {
      console.error('Error al buscar venta por orderId:', error);
    }
  } else {
    console.log('No se pudo extraer orderId del webhook');
  }

  // Determinar nuevo estado según evento
  let nuevoEstado: EstadoPago | null = null;
  
  if ([
    'CHECKOUT.ORDER.APPROVED',
    'PAYMENT.CAPTURE.COMPLETED',
    'CHECKOUT.ORDER.COMPLETED',
  ].includes(eventType)) {
    nuevoEstado = EstadoPago.APROBADO;
    console.log('Evento de aprobación detectado, nuevo estado:', nuevoEstado);
  } else if ([
    'CHECKOUT.ORDER.CANCELLED',
    'PAYMENT.CAPTURE.DENIED',
    'PAYMENT.CAPTURE.REFUNDED',
    'PAYMENT.CAPTURE.REVERSED',
  ].includes(eventType)) {
    nuevoEstado = EstadoPago.CANCELADO;
    console.log('Evento de cancelación detectado, nuevo estado:', nuevoEstado);
  } else {
    console.log('Evento no relevante para cambio de estado:', eventType);
  }

  // Actualizar estado si es necesario
  if (ventaId !== null && nuevoEstado) {
    try {
      console.log(`Actualizando venta ${ventaId} a estado ${nuevoEstado}`);
      await this.ventasService.updateEstadoPago(ventaId, nuevoEstado);
      console.log('Venta actualizada exitosamente');
      
      return {
        ok: true,
        ventaId,
        orderId,
        evento: eventType,
        mensaje: `Venta actualizada a estado ${nuevoEstado}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al actualizar estado de venta:', error);
      throw error;
    }
  }

  const resultado = {
    ok: true,
    mensaje: 'Evento recibido pero no relevante para actualizar venta',
    eventType,
    orderId,
    ventaId,
    razon: ventaId === null ? 'Venta no encontrada' : 'Estado no cambió',
    timestamp: new Date().toISOString()
  };

  console.log('Resultado final:', resultado);
  return resultado;
}

   async capturarOrdenPaypal(orderId: string, ventaId: number, metodoPagoId: number) {
    // Obtener el método de pago para las credenciales
    const [metodoPago] = await this.db.select().from(metodosPago).where(eq(metodosPago.id, metodoPagoId));
    if (!metodoPago) {
      return { error: 'Método de pago de PayPal no encontrado' };
    }
    
    const configuracion = JSON.parse(metodoPago.configuracion ?? '{}');
    const { clientId, clientSecret, mode } = configuracion;
    const paypalApiBaseUrl = mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
    // Obtener accessToken
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const { data: tokenData } = await require('axios').post(
      `${paypalApiBaseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const accessToken = tokenData.access_token;
    // Capturar la orden
    try {
      const { data: captureData } = await require('axios').post(
        `${paypalApiBaseUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      // Si la orden fue capturada exitosamente
      if (captureData.status === 'COMPLETED') {
        await this.ventasService.updateEstadoPago(ventaId, EstadoPago.APROBADO);
        return { ok: true, ventaId, orderId, status: 'COMPLETED', mensaje: 'Venta marcada como pagada' };
      } else {
        await this.ventasService.updateEstadoPago(ventaId, EstadoPago.CANCELADO);
        return { ok: false, ventaId, orderId, status: captureData.status, mensaje: 'Venta cancelada o no completada' };
      }
    } catch (error) {
      await this.ventasService.updateEstadoPago(ventaId, EstadoPago.CANCELADO);
      return { ok: false, ventaId, orderId, error: error.message, mensaje: 'Error al capturar la orden, venta cancelada' };
    }
  }

    async handlePaypalSuccess(orderId: string) {
    const venta = await this.findVentaByOrderId(orderId);
    
    if (!venta) {
      return { ok: false, mensaje: 'Venta no encontrada' };
    }

    const metodoPagoId = Number(venta.metodoPagoId);
    const resultado = await this.capturarOrdenPaypal(orderId, venta.id, metodoPagoId);
    
    return resultado;
  }

    async handlePaypalCancel(orderId?: string) {
    if (!orderId) {
      return { ok: true, mensaje: 'Pago cancelado' };
    }
    const venta = await this.findVentaByOrderId(orderId);    
    if (venta) {
      await this.ventasService.updateEstadoPago(venta.id, EstadoPago.CANCELADO);
    }
    return { ok: true, mensaje: 'Pago cancelado' };
  }

  /**
   * Actualizar estado de pago
   */
  async actualizarEstadoDeposito(
    ventaId: number,
    estado: EstadoPago,
    comprobanteUrl?: string | null,
  ) {
    const [venta] = await this.db
      .select()
      .from(ventas)
      .where(eq(ventas.id, ventaId))
      .limit(1);

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${ventaId} no encontrada`);
    }

    await this.db
      .update(ventas)
      .set({
        estadoPago: estado,
        comprobanteUrl: comprobanteUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(ventas.id, ventaId));

    return {
      mensaje: `Estado de pago actualizado a ${estado}`,
      ventaId,
      estado,
    };
  }

  /**
   * Rechazar pago
   */
  async rechazarPago(ventaId: number, motivo?: string) {
    return this.actualizarEstadoDeposito(ventaId, EstadoPago.RECHAZADO);
  }

 
}


