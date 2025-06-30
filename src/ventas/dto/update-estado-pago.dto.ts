import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoPago } from './ventas.enum';

export class UpdateEstadoPagoDto {
  @ApiProperty({
    description: 'Nuevo estado de pago de la venta',
    enum: EstadoPago,
    example: EstadoPago.APROBADO
  })
  @IsNotEmpty()
  @IsEnum(EstadoPago)
  estadoPago: EstadoPago;
} 