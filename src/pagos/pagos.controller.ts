import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { ValidarDepositoDto } from './dto/validar-deposito.dto';
import { EstadoPago } from '../ventas/dto/ventas.enum';


@Controller('pagos')
export class PagosController {
  constructor(private pagosService: PagosService) {}

  // Simular webhook de PayPal (desde sandbox)
  @Post('paypal/webhook-simulado/:ventaId')
  async webhookPaypal(@Param('ventaId') ventaId: string) {
    await this.pagosService.actualizarEstado(+ventaId, EstadoPago.APROBADO);
    return { mensaje: 'Pago aprobado vía sandbox PayPal' };
  }

  // Validación manual por parte del oficinista
  @Patch('deposito/:ventaId/validar')
  async validarDeposito(
    @Param('ventaId') ventaId: string,
    @Body() dto: ValidarDepositoDto,
  ) {
    await this.pagosService.actualizarEstado(+ventaId, EstadoPago.APROBADO, dto.comprobanteUrl);
    return { mensaje: 'Depósito validado correctamente' };
  }
}
