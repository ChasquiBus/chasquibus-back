import { Injectable } from '@nestjs/common';

@Injectable()
export class DepositoService {
  /**
   * Generar instrucciones de depósito
   */
  procesarPagoDeposito (venta: any, metodoPago: any) {
    const configuracion = JSON.parse(metodoPago.configuracion);
    
    // Generar código de referencia único
    const codigoDeposito = `DEP-${venta.id}-${Date.now().toString().slice(-6)}`;
    
    return {
      codigoDeposito,
      mensaje: 'Instrucciones para realizar el depósito',
      instrucciones: {
        banco: configuracion.banco,
        numeroCuenta: configuracion.numeroCuenta,
        tipoCuenta: configuracion.tipoCuenta,
        titular: configuracion.titular,
        identificacion: configuracion.identificacion,
        instrucciones: configuracion.instrucciones || 'Realice el depósito y cargue el comprobante',
        monto: venta.totalFinal,
        codigoReferencia: codigoDeposito
      },
      venta: {
        id: venta.id,
        totalFinal: venta.totalFinal,
        fechaVenta: venta.fechaVenta
      },
      pasos: [
        '1. Diríjase a cualquier agencia del banco o use banca en línea',
        '2. Realice el depósito a la cuenta especificada',
        '3. Use el código de referencia proporcionado',
        '4. Guarde el comprobante de depósito',
        '5. Cargue el comprobante en el sistema para validación'
      ]
    };
  }

  /**
   * Validar depósito manualmente
   */
  validarDeposito(ventaId: number, comprobanteUrl: string, observaciones?: string) {
    return {
      ventaId,
      estado: 'validado',
      comprobanteUrl,
      observaciones: observaciones || 'Depósito validado manualmente por oficinista',
      fechaValidacion: new Date().toISOString(),
      mensaje: 'Depósito validado correctamente'
    };
  }

  /**
   * Rechazar depósito
   */
  rechazarDeposito(ventaId: number, motivo: string) {
    return {
      ventaId,
      estado: 'rechazado',
      motivo,
      fechaRechazo: new Date().toISOString(),
      mensaje: 'Depósito rechazado'
    };
  }
}
