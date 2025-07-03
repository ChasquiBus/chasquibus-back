import { Injectable } from '@nestjs/common';

@Injectable()
export class PaypalService {
  /**
   * Iniciar pago con PayPal
   */
  iniciarPago(venta: any, metodoPago: any) {
    const configuracion = JSON.parse(metodoPago.configuracion);
    
    // Generar referencia única para la transacción
    const externalReference = generarReferenciaPaypal(venta.id);
    
    // URL simulada del sandbox de PayPal
    const fakeUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${externalReference}&ventaId=${venta.id}`;
    
    return {
      url: fakeUrl,
      externalReference,
      mensaje: 'Redirigiendo al sandbox de PayPal',
      configuracion: {
        clientId: configuracion.clientId,
        mode: configuracion.mode,
        webhookId: configuracion.webhookId
      },
      venta: {
        id: venta.id,
        totalFinal: venta.totalFinal,
        fechaVenta: venta.fechaVenta
      }
    };
  }

  /**
   * Simula el webhook que confirmaría el pago
   */
  confirmarPagoSimulado(ventaId: number, estado: 'aprobado' | 'rechazado' = 'aprobado') {
    return {
      estado,
      ventaId,
      mensaje: estado === 'aprobado' ? 'Pago aprobado vía PayPal' : 'Pago rechazado vía PayPal',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Simular webhook de PayPal con parámetros
   */
  simularWebhook(ventaId: number, paymentStatus: string, transactionId?: string) {
    let estado: 'aprobado' | 'rechazado';
    
    // Simular lógica de validación
    if (paymentStatus === 'COMPLETED' || paymentStatus === 'APPROVED') {
      estado = 'aprobado';
    } else if (paymentStatus === 'DENIED' || paymentStatus === 'FAILED') {
      estado = 'rechazado';
    } else {
      // Para otros estados, simular aprobación aleatoria (70% aprobado, 30% rechazado)
      estado = Math.random() > 0.3 ? 'aprobado' : 'rechazado';
    }

    return {
      estado,
      ventaId,
      transactionId: transactionId || `TXN-${ventaId}-${Date.now()}`,
      paymentStatus,
      mensaje: `Webhook simulado: ${estado}`,
      timestamp: new Date().toISOString()
    };
  }
}

export function generarReferenciaPaypal(ventaId: number): string {
  return `PAYPAL-${ventaId}-${Date.now()}`;
}
