import * as QRCode from 'qrcode';

export interface DatosQRBoleto {
  idBoleto: number;
  nombre: string;
  apellido: string;
  cedula: string;
  usado: boolean;
  cooperativa: string;
  aplicoDescuento: boolean;
}

/**
 * Genera un código QR con la información del boleto
 */
export async function generarCodigoQRBoleto(datos: DatosQRBoleto): Promise<string> {
  try {
    return await QRCode.toDataURL(JSON.stringify(datos));
  } catch (error) {
    console.error('Error al generar código QR:', error);
    return 'null';
  }
}

/**
 * Determina si se aplicó descuento basado en el valor del descuento
 */
export function determinarAplicoDescuento(totalDescPorPers: string): boolean {
  const descuento = parseFloat(totalDescPorPers);
  return !isNaN(descuento) && descuento > 0;
} 