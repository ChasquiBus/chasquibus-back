import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaypalService {

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

  async iniciarPago(venta: any, metodoPago: any) {
    const configuracion = JSON.parse(metodoPago.configuracion);
    // Ahora accedemos a las credenciales desde la configuración
    const { clientId, clientSecret, mode, webhookId } = configuracion;

    // Determinar la URL base de PayPal según el modo (sandbox o live)
    const paypalApiBaseUrl =
      mode === 'sandbox'
        ? 'https://api-m.sandbox.paypal.com'
        : 'https://api-m.paypal.com';

    // Pasamos las credenciales al generador de token
    const accessToken = await this.generateAccessToken(
      clientId,
      clientSecret,
      mode,
    ); // Generar referencia única para la transacción (custom_id)
    const externalReference = `PAYPAL-${venta.id}-${Date.now()}`;

    try {
      const orderResponse = await axios.post(
        `${paypalApiBaseUrl}/v2/checkout/orders`, // Usamos la URL base dinámica
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD', // Asegúrate de que esta moneda coincida con tu configuración de PayPal
                value: venta.totalFinal,
              },
              custom_id: externalReference, // Usar custom_id para la referencia de la venta
              description: `Venta de boletos #${venta.id}`,
            },
          ],
          application_context: {
            return_url: `${process.env.HOST_MOVIL}/paypal/success`, // Asegúrate de que HOST_MOVIL esté configurado correctamente
            cancel_url: `${process.env.HOST_MOVIL}/paypal/cancel`,
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
      ).href;

      return {
        url: approvalLink,
        externalReference: order.id, // ID de la orden de PayPal, no tu custom_id aquí para el front
        mensaje: 'Redirigiendo a PayPal para completar el pago',
        configuracion: {
          // Devolvemos la configuración para que el front sepa qué credenciales se usaron
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
