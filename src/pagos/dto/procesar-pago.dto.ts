import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class ProcesarPagoDto {
  @ApiProperty({ description: 'ID de la venta', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  ventaId: number;

  @ApiProperty({ description: 'ID del método de pago', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  metodoPagoId: number;
} 