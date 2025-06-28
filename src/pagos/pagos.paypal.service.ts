import { Injectable } from '@nestjs/common';

@Injectable()
export class PaypalService {
  iniciarPago(venta) {
    const fakeUrl = `https://sandbox.paypal.com/fake-checkout?ventaId=${venta.id}`;
    return {
      url: fakeUrl,
      mensaje: 'Redirige al sandbox de PayPal',
    };
  }

  // Simula el webhook que confirmaría el pago
  confirmarPagoSimulado(ventaId: number) {
    return {
      estado: 'aprobado',
      ventaId,
    };
  }
}
