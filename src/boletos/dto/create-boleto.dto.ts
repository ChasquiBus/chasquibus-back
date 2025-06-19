import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDecimal, Min, MaxLength } from 'class-validator';

export class CreateBoletoDto {
  @ApiProperty({ description: 'ID de la venta asociada' })
  @IsNumber()
  ventaId: number;

  @ApiProperty({ description: 'ID de la hoja de trabajo' })
  @IsNumber()
  hojaTrabajoId: number;

  @ApiProperty({ description: 'ID del asiento' })
  @IsNumber()
  asientoId: number;

  @ApiProperty({ description: 'ID de la tarifa' })
  @IsNumber()
  tarifaId: number;

  @ApiProperty({ description: 'ID del descuento aplicado', required: false })
  @IsOptional()
  @IsNumber()
  descuentoId?: number;

  @ApiProperty({ description: 'Código QR del boleto', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  codigoQr?: string;

  @ApiProperty({ description: 'Cédula del pasajero' })
  @IsString()
  @MaxLength(20)
  cedula: string;

  @ApiProperty({ description: 'Nombre del pasajero' })
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({ description: 'Total sin descuento por persona' })
  @IsString()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  totalSinDescPorPers: string;

  @ApiProperty({ description: 'Total de descuento por persona' })
  @IsString()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  totalDescPorPers: string;

  @ApiProperty({ description: 'Total por persona' })
  @IsString()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  totalPorPer: string;
} 