import { Body, Controller, Param, Patch, Post, Get, UseGuards, Req, Res, Headers, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { ValidarDepositoDto } from './dto/validar-deposito.dto';
import { RechazarPagoDto } from './dto/rechazar-pago.dto';
import { EstadoPago } from '../ventas/dto/ventas.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { Request, Response } from 'express';
import { PaypalService } from './pagos.paypal.service';
import { Public } from 'auth/decorators/public.decorator';

@ApiTags('Pagos')
@Controller('pagos')
//@ApiBearerAuth('access-token')
//@UseGuards(JwtAuthGuard, RolesGuard)
export class PagosController {
  constructor(private pagosService: PagosService,
    private paypalService: PaypalService
  ) {}

  @Patch('deposito/:ventaId/validar')
//  @Role(RolUsuario.OFICINISTA, RolUsuario.ADMIN)
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
//  @Role(RolUsuario.OFICINISTA, RolUsuario.ADMIN)
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


  @Patch('deposito/:ventaId/cancelar')
//  @Role(RolUsuario.OFICINISTA, RolUsuario.ADMIN, RolUsuario.CLIENTE)
  @ApiOperation({ 
    summary: 'Rechazar depósito',
    description: 'Permite al oficinista rechazar un depósito bancario'
  })
  @ApiParam({ name: 'ventaId', description: 'ID de la venta' })
  @ApiBody({ type: RechazarPagoDto })
  @ApiResponse({ status: 200, description: 'Depósito cancelado correctamente' })
  async cancelarDeposito(
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
@Public() 
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
  console.log('=== WEBHOOK PAYPAL RECIBIDO ===');
  console.log('Headers recibidos:', {
    transmissionId,
    transmissionTime,
    certUrl,
    authAlgo,
    transmissionSig,
    webhookId
  });
  console.log('Body recibido:', JSON.stringify(req.body, null, 2));

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

    console.log('Resultado del procesamiento:', result);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error en webhook PayPal:', error);
    return res.status(400).json({ error: error.message });
  }
}

  /**
   * Endpoint para capturar la orden de PayPal aprobada por el usuario
   */
 @Public() 
@Get('paypal/success')
async paypalSuccess(@Query('token') token: string, @Res() res: Response) {
    console.log('Redirigiendo al cliente con token:', token);
    //console.log('respuesta:', res);
    try {
        // Validar que el token existe
        if (!token) {
            return res.redirect(
                `${process.env.CLIENT_HOST_MOVIL}/paypal/error?message=Token+no+proporcionado`
            );
        }

        const resultado = await this.pagosService.handlePaypalSuccess(token);
        
        if (resultado.ok) {
            return res.redirect(
                `${process.env.CLIENT_HOST_MOVIL}/paginas-pagos/paypal-success?orderId=${token}&status=success`
            );
        } else {
            const mensaje = resultado.mensaje || 'Error+desconocido';
            return res.redirect(
                `${process.env.CLIENT_HOST_MOVIL}/paypal/error?message=${encodeURIComponent(mensaje)}`
            );
        }

    } catch (error) {
        console.error('Error en paypalSuccess controller:', error);
        return res.redirect(
            `${process.env.CLIENT_HOST_MOVIL}/paypal/error?message=Error+interno`
        );
    }
}

 @Public() 
  @Get('paypal/cancel')
  async paypalCancel(@Query('token') token: string, @Res() res: Response) {
    try {
      const resultado = await this.pagosService.handlePaypalCancel(token);
      
      // Independientemente del resultado, redirigir a la página de cancelación
      return res.redirect(`${process.env.CLIENT_HOST_MOVIL}/paypal/cancel`);
      
    } catch (error) {
      console.error('Error en paypalCancel controller:', error);
      return res.redirect(
        `${process.env.CLIENT_HOST_MOVIL}/paypal/error?message=Error+al+cancelar`
      );
    }
  }

}
