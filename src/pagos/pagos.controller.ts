import { Body, Controller, Param, Patch, Post, Get, UseGuards, Req, Res, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { ValidarDepositoDto } from './dto/validar-deposito.dto';
import { RechazarPagoDto } from './dto/rechazar-pago.dto';
import { EstadoPago } from '../ventas/dto/ventas.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { Request, Response } from 'express';

@ApiTags('Pagos')
@Controller('pagos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PagosController {
  constructor(private pagosService: PagosService) {}

    /**
   * Validación manual por parte del oficinista para depósitos
   */
  @Patch('deposito/:ventaId/validar')
  @Role(RolUsuario.OFICINISTA, RolUsuario.ADMIN)
  @ApiOperation({ 
    summary: 'Validar depósito manualmente',
    description: 'Permite al oficinista validar manualmente un depósito bancario'
  })
  @ApiParam({ name: 'ventaId', description: 'ID de la venta' })
  @ApiBody({ type: ValidarDepositoDto })
  @ApiResponse({ status: 200, description: 'Depósito validado correctamente' })
  async validarDeposito(
    @Param('ventaId') ventaId: string,
    @Body() dto: ValidarDepositoDto,
  ) {
    const resultado = this.pagosService['depositoService'].validarDeposito(+ventaId, dto.comprobanteUrl, dto.observaciones);
    await this.pagosService.actualizarEstadoDeposito(+ventaId, EstadoPago.APROBADO, dto.comprobanteUrl);
    
    return {
      ...resultado,
      mensaje: 'Depósito validado correctamente'
    };
  }

  /**
   * Rechazar depósito
   */
  @Patch('deposito/:ventaId/rechazar')
  @Role(RolUsuario.OFICINISTA, RolUsuario.ADMIN)
  @ApiOperation({ 
    summary: 'Rechazar depósito',
    description: 'Permite al oficinista rechazar un depósito bancario'
  })
  @ApiParam({ name: 'ventaId', description: 'ID de la venta' })
  @ApiBody({ type: RechazarPagoDto })
  @ApiResponse({ status: 200, description: 'Depósito rechazado correctamente' })
  async rechazarDeposito(
    @Param('ventaId') ventaId: string,
    @Body() dto: RechazarPagoDto
  ) {
    const resultado = this.pagosService['depositoService'].rechazarDeposito(+ventaId, dto.motivo || 'Sin motivo especificado');
    await this.pagosService.actualizarEstadoDeposito(+ventaId, EstadoPago.RECHAZADO);
    
    return {
      ...resultado,
      mensaje: 'Depósito rechazado correctamente'
    };
  }

  /**
   * Webhook real de PayPal
   */
  @Post('webhook/paypal')
  @ApiOperation({ summary: 'Webhook real de PayPal', description: 'Recibe notificaciones de PayPal y actualiza el estado de la venta' })
  @ApiBody({ type: Object })
  async webhookPaypalReal(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('paypal-transmission-id') transmissionId: string,
    @Headers('paypal-transmission-time') transmissionTime: string,
    @Headers('paypal-cert-url') certUrl: string,
    @Headers('paypal-auth-algo') authAlgo: string,
    @Headers('paypal-transmission-sig') transmissionSig: string,
    @Headers('paypal-webhook-id') webhookId: string
  ) {
    try {
      const result = await this.pagosService.procesarWebhook({
        headers: {
          transmissionId,
          transmissionTime,
          certUrl,
          authAlgo,
          transmissionSig,
          webhookId
        },
        body: req.body
      });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
