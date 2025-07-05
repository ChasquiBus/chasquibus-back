import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto, CreateVentaPresencialDto } from './dto/create-venta.dto';
import { Venta } from './entities/venta.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { CrearVentaService } from './crear-venta.service';
import { Request } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { EstadoPago, TipoVenta } from './dto/ventas.enum';

@Controller('ventas')
@ApiTags('ventas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VentasController {
  constructor(
    private readonly ventasService: VentasService,
    private readonly crearVentaService: CrearVentaService
  ) {}

  @Post('app-cliente')
  @Role(RolUsuario.CLIENTE)
  @ApiOperation({ 
    summary: 'Crear una nueva venta con información completa de pago',
    description: 'Crea una venta y retorna información completa incluyendo boletos y datos de pago'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Venta creada exitosamente con información de pago',
    schema: {
      type: 'object',
      properties: {
        venta: { type: 'object' },
        boletos: { type: 'array' },
        pago: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  createConPago(@Body() createVentaDto: CreateVentaDto, @Req() req: Request) {
    const usuarioId = (req.user as any).sub;
    return this.crearVentaService.createVentaConPago(createVentaDto, usuarioId);
  }

  @Post('presencial')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ 
    summary: 'Crear una nueva venta presencial (efectivo)',
    description: 'Crea una venta presencial y retorna la venta y los boletos'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Venta presencial creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        venta: { type: 'object' },
        boletos: { type: 'array' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  crearVentaPresencial(@Body() createVentaPresencialDto: CreateVentaPresencialDto, @Req() req: Request) {
    const usuarioId = (req.user as any).sub;
    return this.crearVentaService.crearVentaPresencial(createVentaPresencialDto, usuarioId);
  }

  // Para admins - obtener todas las ventas de un oficinista
  @Get('oficinista/:oficinistaId')
  @Role(RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Obtener todas las ventas de un oficinista específico' })
  @ApiParam({ name: 'oficinistaId', description: 'ID del oficinista' })
  @ApiResponse({ status: 200, description: 'Ventas del oficinista', type: [Venta] })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByOficinista(@Param('oficinistaId', ParseIntPipe) oficinistaId: number): Promise<Venta[]> {
    return this.ventasService.findByOficinista(oficinistaId);
  }

  // Para oficinistas/admins - obtener todas las ventas de la cooperativa
  @Get('cooperativa')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener todas las ventas de la cooperativa del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Ventas de la cooperativa', type: [Venta] })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByCooperativa(@CurrentUser() user: JwtPayload): Promise<Venta[]> {
    if (!user.cooperativaId) {
      throw new BadRequestException('Cooperativa ID no encontrada en el token');
    }
    return this.ventasService.findByCooperativa(user.cooperativaId);
  }

  // Para oficinistas/admins - obtener ventas por estado de pago de la cooperativa
  @Get('cooperativa/estado/:estadoPago')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener ventas por estado de pago de la cooperativa' })
  @ApiParam({ name: 'estadoPago', description: 'Estado de pago', enum: EstadoPago })
  @ApiResponse({ status: 200, description: 'Ventas con el estado especificado', type: [Venta] })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByCooperativaAndEstadoPago(
    @CurrentUser() user: JwtPayload,
    @Param('estadoPago') estadoPago: EstadoPago
  ): Promise<Venta[]> {
    if (!user.cooperativaId) {
      throw new BadRequestException('Cooperativa ID no encontrada en el token');
    }
    return this.ventasService.findByCooperativaAndEstadoPago(user.cooperativaId, estadoPago);
  }

  // Para oficinistas/admins - obtener ventas por tipo de venta de la cooperativa
  @Get('cooperativa/tipo/:tipoVenta')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener ventas por tipo de venta de la cooperativa' })
  @ApiParam({ name: 'tipoVenta', description: 'Tipo de venta', enum: TipoVenta })
  @ApiResponse({ status: 200, description: 'Ventas con el tipo especificado', type: [Venta] })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByCooperativaAndTipoVenta(
    @CurrentUser() user: JwtPayload,
    @Param('tipoVenta') tipoVenta: TipoVenta
  ): Promise<Venta[]> {
    if (!user.cooperativaId) {
      throw new BadRequestException('Cooperativa ID no encontrada en el token');
    }
    return this.ventasService.findByCooperativaAndTipoVenta(user.cooperativaId, tipoVenta);
  }



  // Para clientes - obtener ventas del cliente con estado pagado
  @Get('mis-ventas')
  @Role(RolUsuario.CLIENTE)
  @ApiOperation({ summary: 'Obtener todas las ventas del cliente autenticado (solo pagadas)' })
  @ApiResponse({ status: 200, description: 'Ventas del cliente con estado pagado', type: [Venta] })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findMyVentas(@CurrentUser() user: JwtPayload): Promise<Venta[]> {
    return this.ventasService.findByClientePagadas(user.sub);
  }

  @Get('cliente/:clienteId')
  @Role(RolUsuario.OFICINISTA, RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Obtener ventas por cliente' })
  @ApiResponse({ status: 200, description: 'Ventas del cliente', type: [Venta] })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByCliente(@Param('clienteId') clienteId: string): Promise<Venta[]> {
    return this.ventasService.findByCliente(+clienteId);
  }

  @Get('estado/:estadoPago')
  @Role(RolUsuario.OFICINISTA, RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Obtener ventas por estado de pago' })
  @ApiResponse({ status: 200, description: 'Ventas con el estado especificado', type: [Venta] })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByEstadoPago(@Param('estadoPago') estadoPago: string): Promise<Venta[]> {
    return this.ventasService.findByEstadoPago(estadoPago);
  }

  @Get(':id')
  @Role(RolUsuario.OFICINISTA, RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Obtener una venta por ID' })
  @ApiResponse({ status: 200, description: 'Venta encontrada', type: Venta })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string): Promise<Venta> {
    return this.ventasService.findOne(+id);
  }
} 