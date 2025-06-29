import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class RechazarPagoDto {
  @ApiProperty({ 
    description: 'Motivo del rechazo del pago', 
    example: 'Comprobante no válido',
    required: false 
  })
  @IsString()
  @IsOptional()
  motivo?: string;
} 