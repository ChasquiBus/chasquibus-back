// dto/response-metodo-pago.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ConfiguracionDepositoDto, ConfiguracionPaypalDto, TipoMetodoPago } from './create-metodo-pago.dto';

export class ResponseMetodoPagoDto {
  @ApiProperty({ description: 'ID del método de pago' })
  id: number;

  @ApiProperty({ description: 'ID de la cooperativa de transporte' })
  cooperativaId: number;

  @ApiProperty({ description: 'Nombre del método de pago' })
  nombre: string;

  @ApiProperty({ description: 'Descripción del método de pago' })
  descripcion?: string;

  @ApiProperty({ description: 'Tipo de método de pago', enum: TipoMetodoPago })
  procesador: TipoMetodoPago;

  @ApiProperty({ description: 'Configuración del método de pago (depende del tipo)' })
  configuracion: ConfiguracionDepositoDto | ConfiguracionPaypalDto;

  @ApiProperty({ description: 'Estado activo del método de pago' })
  activo: boolean;
}