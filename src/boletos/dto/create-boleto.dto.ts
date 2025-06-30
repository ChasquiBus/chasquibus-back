import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDecimal, Min, MaxLength, IsNumberString } from 'class-validator';

export class CreateBoletoDto {
/*  @ApiProperty({ description: 'ID de la venta asociada' })
  @IsNumber()
  ventaId: number;
*/

  @ApiProperty({ description: 'Numero de asiento' })
  @IsNumber()
  asientoNumero: number;

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

  @ApiProperty({ description: 'Total sin descuento por persona', example: '25.50' })
  @IsNumberString({}, { message: 'totalSinDescPorPers debe ser un número válido' })
  totalSinDescPorPers: string;
  
  @ApiProperty({ description: 'Total de descuento por persona', example: '2.50' })
  @IsNumberString({}, { message: 'totalDescPorPers debe ser un número válido' })
  totalDescPorPers: string;
  
  @ApiProperty({ description: 'Total por persona', example: '23.00' })
  @IsNumberString({}, { message: 'totalPorPer debe ser un número válido' })
  totalPorPer: string;
} 