import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDateString, IsDecimal, Min } from 'class-validator';

export class UpdateVentaDto {
  @ApiProperty({ description: 'ID de la cooperativa', required: false })
  @IsOptional()
  @IsNumber()
  cooperativaId?: number;

  @ApiProperty({ description: 'ID del cliente', required: false })
  @IsOptional()
  @IsNumber()
  clienteId?: number;

  @ApiProperty({ description: 'ID del oficinista', required: false })
  @IsOptional()
  @IsNumber()
  oficinistaId?: number;

  @ApiProperty({ description: 'ID del método de pago', required: false })
  @IsOptional()
  @IsNumber()
  metodoPagoId?: number;

  @ApiProperty({ description: 'Estado del pago', example: 'PENDIENTE', required: false })
  @IsOptional()
  @IsString()
  estadoPago?: string;

  @ApiProperty({ description: 'URL del comprobante', required: false })
  @IsOptional()
  @IsString()
  comprobanteUrl?: string;

  @ApiProperty({ description: 'Fecha de la venta', required: false })
  @IsOptional()
  @IsDateString()
  fechaVenta?: string;

  @ApiProperty({ description: 'Tipo de venta', example: 'BOLETO', required: false })
  @IsOptional()
  @IsString()
  tipoVenta?: string;

  @ApiProperty({ description: 'Total sin descuento', required: false })
  @IsOptional()
  @IsDecimal()
  @Min(0)
  totalSinDescuento?: number;

  @ApiProperty({ description: 'Total de descuentos', required: false })
  @IsOptional()
  @IsDecimal()
  @Min(0)
  totalDescuentos?: number;

  @ApiProperty({ description: 'Total final', required: false })
  @IsOptional()
  @IsDecimal()
  @Min(0)
  totalFinal?: number;
} 