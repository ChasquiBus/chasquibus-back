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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Venta } from './entities/venta.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { CrearVentaService } from './crear-venta.service';
import { Request } from 'express';

@ApiTags('ventas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService,
    private readonly crearVentaService: CrearVentaService
  ) {}


  @Post('app-cliente')
  @Role( RolUsuario.CLIENTE)
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
  crearVentaPresencial(@Body() createVentaDto: CreateVentaDto, @Req() req: Request) {
    const usuarioId = (req.user as any).sub;
    return this.crearVentaService.crearVentaPresencial(createVentaDto, usuarioId);
  }

  @Get()
  @Role(RolUsuario.OFICINISTA, RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Obtener todas las ventas' })
  @ApiResponse({ status: 200, description: 'Lista de ventas', type: [Venta] })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(): Promise<Venta[]> {
    return this.ventasService.findAll();
  }

  @Get('stats')
  @Role(RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Obtener estadísticas de ventas' })
  @ApiResponse({ status: 200, description: 'Estadísticas de ventas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getStats() {
    return this.ventasService.getVentasStats();
  }

  @Get('cliente/:clienteId')
  @Role(RolUsuario.OFICINISTA, RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Obtener ventas por cliente' })
  @ApiResponse({ status: 200, description: 'Ventas del cliente', type: [Venta] })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByCliente(@Param('clienteId') clienteId: string): Promise<Venta[]> {
    return this.ventasService.findByCliente(+clienteId);
  }

  @Get('cooperativa/:cooperativaId')
  @Role(RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Obtener ventas por cooperativa' })
  @ApiResponse({ status: 200, description: 'Ventas de la cooperativa', type: [Venta] })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByCooperativa(@Param('cooperativaId') cooperativaId: string): Promise<Venta[]> {
    return this.ventasService.findByCooperativa(+cooperativaId);
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

  @Patch(':id')
  @Role(RolUsuario.OFICINISTA, RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Actualizar una venta' })
  @ApiResponse({ status: 200, description: 'Venta actualizada exitosamente', type: Venta })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(
    @Param('id') id: string,
    @Body() updateVentaDto: UpdateVentaDto,
  ): Promise<Venta> {
    return this.ventasService.update(+id, updateVentaDto);
  }

  @Delete(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Eliminar una venta' })
  @ApiResponse({ status: 200, description: 'Venta eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: string): Promise<void> {
    return this.ventasService.remove(+id);
  }
} 