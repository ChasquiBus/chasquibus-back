// src/pagos/dto/iniciar-pago.dto.ts
import { IsInt } from 'class-validator';

export class IniciarPagoDto {
  @IsInt()
  ventaId: number;

  @IsInt()
  metodoPagoId: number;
}
