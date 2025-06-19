import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDateString, IsDecimal, Min } from 'class-validator';

export class CreateVentaDto {
  @ApiProperty({ description: 'ID de la cooperativa' })
  @IsNumber()
  cooperativaId: number;

  @ApiProperty({ description: 'ID del cliente' })
  @IsNumber()
  clienteId: number;

  @ApiProperty({ description: 'ID del oficinista' })
  @IsNumber()
  oficinistaId: number;

  @ApiProperty({ description: 'ID del método de pago' })
  @IsNumber()
  metodoPagoId: number;

  @ApiProperty({ description: 'Estado del pago', example: 'PENDIENTE' })
  @IsString()
  estadoPago: string;

  @ApiProperty({ description: 'URL del comprobante', required: false })
  @IsOptional()
  @IsString()
  comprobanteUrl?: string;

  @ApiProperty({ description: 'Fecha de la venta' })
  @IsDateString()
  fechaVenta: string;

  @ApiProperty({ description: 'Tipo de venta', example: 'BOLETO' })
  @IsString()
  tipoVenta: string;

  @ApiProperty({ description: 'Total sin descuento' })
  @IsDecimal()
  @Min(0)
  totalSinDescuento: number;

  @ApiProperty({ description: 'Total de descuentos' })
  @IsDecimal()
  @Min(0)
  totalDescuentos: number;

  @ApiProperty({ description: 'Total final' })
  @IsDecimal()
  @Min(0)
  totalFinal: number;
} 