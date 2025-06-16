import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TarifasParadasService } from './tarifas-paradas.service';
import { CreateTarifasParadaDto } from './dto/create-tarifas-parada.dto';
import { UpdateTarifasParadaDto } from './dto/update-tarifas-parada.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { TarifasParada } from './entities/tarifas-parada.entity';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';

@ApiTags('tarifas-paradas')
@Controller('tarifas-paradas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
export class TarifasParadasController {
  constructor(private readonly tarifasParadasService: TarifasParadasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva tarifa entre paradas' })
  @ApiResponse({ status: 201, description: 'Tarifa creada exitosamente', type: TarifasParada })
  create(@Body() createTarifasParadaDto: CreateTarifasParadaDto) {
    return this.tarifasParadasService.create(createTarifasParadaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tarifas entre paradas' })
  @ApiResponse({ status: 200, description: 'Lista de tarifas obtenida exitosamente', type: [TarifasParada] })
  findAll() {
    return this.tarifasParadasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarifa específica por ID' })
  @ApiResponse({ status: 200, description: 'Tarifa encontrada exitosamente', type: TarifasParada })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasParadasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarifa específica' })
  @ApiResponse({ status: 200, description: 'Tarifa actualizada exitosamente', type: TarifasParada })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTarifasParadaDto: UpdateTarifasParadaDto
  ) {
    return this.tarifasParadasService.update(id, updateTarifasParadaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarifa específica' })
  @ApiResponse({ status: 200, description: 'Tarifa eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasParadasService.remove(id);
  }
}
