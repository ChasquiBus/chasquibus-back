import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BoletosService } from './boletos.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { Boleto } from './entities/boleto.entity';

@ApiTags('boletos')
@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo boleto' })
  @ApiResponse({ status: 201, description: 'Boleto creado exitosamente', type: Boleto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createBoletoDto: CreateBoletoDto): Promise<Boleto> {
    return this.boletosService.create(createBoletoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los boletos' })
  @ApiResponse({ status: 200, description: 'Lista de boletos', type: [Boleto] })
  findAll(): Promise<Boleto[]> {
    return this.boletosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un boleto por ID' })
  @ApiParam({ name: 'id', description: 'ID del boleto' })
  @ApiResponse({ status: 200, description: 'Boleto encontrado', type: Boleto })
  @ApiResponse({ status: 404, description: 'Boleto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Boleto> {
    return this.boletosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un boleto' })
  @ApiParam({ name: 'id', description: 'ID del boleto' })
  @ApiResponse({ status: 200, description: 'Boleto actualizado exitosamente', type: Boleto })
  @ApiResponse({ status: 404, description: 'Boleto no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBoletoDto: UpdateBoletoDto,
  ): Promise<Boleto> {
    return this.boletosService.update(id, updateBoletoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un boleto' })
  @ApiParam({ name: 'id', description: 'ID del boleto' })
  @ApiResponse({ status: 200, description: 'Boleto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Boleto no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.boletosService.remove(id);
  }

  @Get('venta/:ventaId')
  @ApiOperation({ summary: 'Obtener boletos por ID de venta' })
  @ApiParam({ name: 'ventaId', description: 'ID de la venta' })
  @ApiResponse({ status: 200, description: 'Boletos de la venta', type: [Boleto] })
  findByVentaId(@Param('ventaId', ParseIntPipe) ventaId: number): Promise<Boleto[]> {
    return this.boletosService.findByVentaId(ventaId);
  }



  @Get('cedula/:cedula')
  @ApiOperation({ summary: 'Obtener boletos por cédula del pasajero' })
  @ApiParam({ name: 'cedula', description: 'Cédula del pasajero' })
  @ApiResponse({ status: 200, description: 'Boletos del pasajero', type: [Boleto] })
  findByCedula(@Param('cedula') cedula: string): Promise<Boleto[]> {
    return this.boletosService.findByCedula(cedula);
  }
} 