import { ApiProperty } from '@nestjs/swagger';

export class Venta {
  @ApiProperty({ description: 'ID único de la venta' })
  id: number;

  @ApiProperty({ description: 'ID de la cooperativa' })
  cooperativaId: number | null;

  @ApiProperty({ description: 'ID del cliente' })
  clienteId: number | null;

  @ApiProperty({ description: 'ID del oficinista' })
  oficinistaId: number | null;

  @ApiProperty({ description: 'ID del método de pago' })
  metodoPagoId: number | null;

  @ApiProperty({ description: 'Estado del pago' })
  estadoPago: string | null;

  @ApiProperty({ description: 'URL del comprobante' })
  comprobanteUrl: string | null;

  @ApiProperty({ description: 'Fecha de la venta' })
  fechaVenta: Date | null;

  @ApiProperty({ description: 'Tipo de venta' })
  tipoVenta: string | null;

  @ApiProperty({ description: 'Total sin descuento' })
  totalSinDescuento: string | null;

  @ApiProperty({ description: 'Total de descuentos' })
  totalDescuentos: string | null;

  @ApiProperty({ description: 'Total final' })
  totalFinal: string | null;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date | null;

  @ApiProperty({ description: 'Fecha de actualización' })
  updatedAt: Date | null;
} 