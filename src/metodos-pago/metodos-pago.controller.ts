// metodos-pago.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { MetodosPagoService } from './metodos-pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { ResponseMetodoPagoDto } from './dto/response-metodo-pago.dto';
import { RolUsuario } from '../auth/roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('metodos-pago')
@Controller('metodos-pago')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MetodosPagoController {
  constructor(private readonly metodosPagoService: MetodosPagoService) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ 
    summary: 'Crear un nuevo método de pago',
    description: 'Permite crear métodos de pago de tipo depósito bancario o PayPal para la cooperativa del usuario autenticado'
  })
  @ApiResponse({
    status: 201,
    description: 'Método de pago creado exitosamente',
    type: ResponseMetodoPagoDto
  })
  async create(
    @Body() createMetodoPagoDto: CreateMetodoPagoDto,
    @CurrentUser() user: JwtPayload
  ) {
    return await this.metodosPagoService.create(createMetodoPagoDto, user);
  }

  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA, RolUsuario.CHOFER)
  @ApiOperation({ 
    summary: 'Obtener métodos de pago de la cooperativa',
    description: 'Lista los métodos de pago de la cooperativa del usuario autenticado'
  })
  @ApiQuery({
    name: 'activos',
    required: false,
    description: 'Filtrar solo métodos activos de la cooperativa del usuario',
    type: Boolean
  })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query('activos') activos?: string
  ) {
    if (activos === 'true') {
      return await this.metodosPagoService.findActiveByUser(user);
    }
    
    return await this.metodosPagoService.findAll(user);
  }

  @Get('activos')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA, RolUsuario.CHOFER, RolUsuario.CLIENTE)
  @ApiOperation({ 
    summary: 'Obtener métodos de pago activos',
    description: 'Obtiene solo los métodos de pago activos de la cooperativa del usuario'
  })
  async findActive(@CurrentUser() user: JwtPayload) {
    return await this.metodosPagoService.findActiveByUser(user);
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA, RolUsuario.CHOFER)
  @ApiOperation({ 
    summary: 'Obtener un método de pago por ID',
    description: 'Obtiene los detalles de un método de pago específico de la cooperativa del usuario'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del método de pago',
    type: Number
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload
  ) {
    return await this.metodosPagoService.findOne(id, user);
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ 
    summary: 'Actualizar un método de pago',
    description: 'Actualiza los datos de un método de pago existente de la cooperativa del usuario'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del método de pago a actualizar',
    type: Number
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMetodoPagoDto: UpdateMetodoPagoDto,
    @CurrentUser() user: JwtPayload
  ) {
    return await this.metodosPagoService.update(id, updateMetodoPagoDto, user);
  }

  @Delete(':id')
  @Role(RolUsuario.ADMIN)
  @ApiOperation({ 
    summary: 'Desactivar un método de pago',
    description: 'Desactiva un método de pago de la cooperativa del usuario (soft delete)'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del método de pago a desactivar',
    type: Number
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload
  ) {
    await this.metodosPagoService.remove(id, user);
    return { message: 'Método de pago desactivado exitosamente' };
  }

  @Patch(':id/toggle-active')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ 
    summary: 'Activar/Desactivar método de pago',
    description: 'Cambia el estado activo de un método de pago de la cooperativa del usuario'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del método de pago',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del método de pago cambiado exitosamente',
    type: ResponseMetodoPagoDto
  })
  async toggleActive(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload
  ) {
    return await this.metodosPagoService.toggleActive(id, user);
  }

  /*
  @Get(':id/configuracion-deposito')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ 
    summary: 'Obtener configuración de depósito',
    description: 'Obtiene la configuración específica para métodos de pago tipo depósito de la cooperativa del usuario'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del método de pago tipo depósito',
    type: Number
  })
  async getConfiguracionDeposito(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload
  ) {
    return await this.metodosPagoService.getConfiguracionDeposito(id, user);
  }

  @Get(':id/configuracion-paypal')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ 
    summary: 'Obtener configuración de PayPal',
    description: 'Obtiene la configuración específica para métodos de pago tipo PayPal de la cooperativa del usuario'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del método de pago tipo PayPal',
    type: Number
  })
  async getConfiguracionPaypal(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload
  ) {
    return await this.metodosPagoService.getConfiguracionPaypal(id, user);
  }

  */
}