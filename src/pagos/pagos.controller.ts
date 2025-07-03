import { Body, Controller, Param, Patch, Post, Get, UseGuards, Req, Res, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { ValidarDepositoDto } from './dto/validar-deposito.dto';
import { RechazarPagoDto } from './dto/rechazar-pago.dto';
import { WebhookPaypalDto } from './dto/webhook-paypal.dto';
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
   * Procesar pago después de crear una venta
   */
  @Post('procesar/:ventaId/:metodoPagoId')
  @ApiOperation({ 
    summary: 'Procesar pago de una venta',
    description: 'Procesa el pago de una venta según el método de pago seleccionado'
  })
  @ApiParam({ name: 'ventaId', description: 'ID de la venta' })
  @ApiParam({ name: 'metodoPagoId', description: 'ID del método de pago' })
  @ApiResponse({ status: 200, description: 'Pago procesado exitosamente' })
  async procesarPago(
    @Param('ventaId') ventaId: string,
    @Param('metodoPagoId') metodoPagoId: string
  ) {
    return await this.pagosService.procesarPago(+ventaId, +metodoPagoId);
  }


  /**
   * Simular webhook de PayPal (desde sandbox)
   */
  @Post('paypal/webhook-simulado/:ventaId')
  @ApiOperation({ 
    summary: 'Simular webhook de PayPal',
    description: 'Simula la recepción de un webhook de PayPal para aprobar/rechazar pagos'
  })
  @ApiParam({ name: 'ventaId', description: 'ID de la venta' })
  @ApiBody({ type: WebhookPaypalDto })
  @ApiResponse({ status: 200, description: 'Webhook procesado exitosamente' })
  async webhookPaypal(
    @Param('ventaId') ventaId: string,
    @Body() dto: WebhookPaypalDto
  ) {
    const { paymentStatus = 'COMPLETED', transactionId } = dto;
    const resultado = this.pagosService['paypalService'].simularWebhook(+ventaId, paymentStatus, transactionId);
    
    // Actualizar estado según el resultado del webhook
    const estado = resultado.estado === 'aprobado' ? EstadoPago.APROBADO : EstadoPago.RECHAZADO;
    await this.pagosService.actualizarEstado(+ventaId, estado);
    
    return {
      ...resultado,
      mensaje: `Pago ${resultado.estado} vía sandbox PayPal`
    };
  }

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
    await this.pagosService.actualizarEstado(+ventaId, EstadoPago.APROBADO, dto.comprobanteUrl);
    
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
    await this.pagosService.actualizarEstado(+ventaId, EstadoPago.RECHAZADO);
    
    return {
      ...resultado,
      mensaje: 'Depósito rechazado correctamente'
    };
  }

  /**
   * Cancelar pago
   */
  @Patch('cancelar/:ventaId')
  @ApiOperation({ 
    summary: 'Cancelar pago',
    description: 'Cancela un pago pendiente'
  })
  @ApiParam({ name: 'ventaId', description: 'ID de la venta' })
  @ApiResponse({ status: 200, description: 'Pago cancelado correctamente' })
  async cancelarPago(@Param('ventaId') ventaId: string) {
    return await this.pagosService.cancelarPago(+ventaId);
  }

  /**
   * Rechazar pago
   */
  @Patch('rechazar/:ventaId')
  @Role(RolUsuario.OFICINISTA, RolUsuario.ADMIN)
  @ApiOperation({ 
    summary: 'Rechazar pago',
    description: 'Rechaza un pago pendiente'
  })
  @ApiParam({ name: 'ventaId', description: 'ID de la venta' })
  @ApiBody({ type: RechazarPagoDto })
  @ApiResponse({ status: 200, description: 'Pago rechazado correctamente' })
  async rechazarPago(
    @Param('ventaId') ventaId: string,
    @Body() dto: RechazarPagoDto
  ) {
    return await this.pagosService.rechazarPago(+ventaId, dto.motivo);
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
