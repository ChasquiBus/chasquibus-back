import { ApiProperty } from '@nestjs/swagger';

export class Boleto {
  @ApiProperty({ description: 'ID único del boleto' })
  id: number;

  @ApiProperty({ description: 'ID de la venta asociada' })
  ventaId: number | null;

  @ApiProperty({ description: 'ID del asiento' })
  asientoNumero: number | null;

  @ApiProperty({ description: 'ID de la tarifa' })
  tarifaId: number | null;

  @ApiProperty({ description: 'ID del descuento aplicado', required: false })
  descuentoId?: number | null;

  @ApiProperty({ description: 'Código QR del boleto', required: false })
  codigoQr?: string | null;

  @ApiProperty({ description: 'Cédula del pasajero' })
  cedula: string | null;

  @ApiProperty({ description: 'Nombre del pasajero' })
  nombre: string | null;

  @ApiProperty({ description: 'Total sin descuento por persona' })
  totalSinDescPorPers: string | null;

  @ApiProperty({ description: 'Total de descuento por persona' })
  totalDescPorPers: string | null;

  @ApiProperty({ description: 'Total por persona' })
  totalPorPer: string | null;
}

export class BoletoDetalleResponseDto {
  id: number;
  ventaId: number | null;
  tarifaId: number | null;
  descuentoId?: number | null;
  asientoNumero: number | null;
  codigoQr?: string | null;
  cedula: string | null;
  nombre: string | null;
  totalSinDescPorPers: string | null;
  totalDescPorPers: string | null;
  totalPorPer: string | null;

  // Campos adicionales
  valorTarifa: string | null;
  tipoAsiento: string | null;
  tipoVenta?: string | null;
  hojaTrabajoId?: number | null;
  cooperativaId?: number | null;
  nombreCooperativa?: string | null;
  logoCooperativa?: string | null;
  telefonoCooperativa?: string | null;
  busId?: number | null;
  estadoHojaTrabajo?: string | null;
  frecDiaId?: number | null;
  fechaSalida?: string | null;
  numeroBus?: string | null;
  placaBus?: string | null;
  horaSalidaProg?: string | null;
  rutaId?: number | null;
  codigoRuta?: string | null;
} 