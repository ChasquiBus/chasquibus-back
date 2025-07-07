import { forwardRef, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ventas } from '../drizzle/schema/ventas';
import { eq } from 'drizzle-orm';
import { Database } from 'drizzle/database';
import { DRIZZLE } from 'drizzle/drizzle.module';

@Injectable()
export class PaypalService {
  constructor(@Inject(DRIZZLE) private readonly db: Database){}

  private async generateAccessToken(
    clientId: string,
    clientSecret: string,
    mode: 'sandbox' | 'live',
  ): Promise<string> {
    const paypalApiBaseUrl =
      mode === 'sandbox'
        ? 'https://api-m.sandbox.paypal.com'
        : 'https://api-m.paypal.com';
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const { data } = await axios.post(
      `${paypalApiBaseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return data.access_token;
  }

async procesarPagoPaypal(venta: any, metodoPago: any) {
  const configuracion = JSON.parse(metodoPago.configuracion);
  const { clientId, clientSecret, mode, webhookId } = configuracion;
  console.log('Venta:', venta);
  const paypalApiBaseUrl =
    mode === 'sandbox'
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com';

  const accessToken = await this.generateAccessToken(
    clientId,
    clientSecret,
    mode,
  );

  try {
    const orderResponse = await axios.post(
      `${paypalApiBaseUrl}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: venta.totalFinal,
            },
            description: `Venta de boletos #${venta.id}`,
          },
        ],
        application_context: {
          return_url: `${process.env.NGROK_URL}/pagos/paypal/success`,
          cancel_url: `${process.env.NGROK_URL}/pagos/paypal/cancel`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const order = orderResponse.data;
    const approvalLink = order.links.find(
      (link: any) => link.rel === 'approve',
    )?.href;

    // 🔥 AQUÍ ESTÁ LA SOLUCIÓN: Actualizar la venta con el orderId
    await this.db
      .update(ventas)
      .set({ orderId: order.id })
      .where(eq(ventas.id, venta.id));

    console.log(`Venta ${venta.id} actualizada con orderId: ${order.id}`);

    return {
      url: approvalLink,
      orderId: order.id,
      mensaje: 'Redirigiendo a PayPal para completar el pago',
      configuracion: {
        clientId: configuracion.clientId,
        mode: configuracion.mode,
        webhookId: configuracion.webhookId,
      },
      venta: {
        id: venta.id,
        totalFinal: venta.totalFinal,
        fechaVenta: venta.fechaVenta,
      },
    };
  } catch (error) {
    console.error(
      'Error al iniciar pago con PayPal:',
      error.response?.data || error.message,
    );
    throw new Error('Error al procesar el pago con PayPal.');
  }
}


}
