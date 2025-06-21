import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { TarifasParadasService } from './tarifas-paradas.service';
import { CreateTarifasParadaDto } from './dto/create-tarifas-parada.dto';
import { UpdateTarifasParadaDto } from './dto/update-tarifas-parada.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { TarifasParada } from './entities/tarifas-parada.entity';

@ApiTags('tarifas')
@Controller('tarifas-paradas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
export class TarifasParadasController {
  constructor(private readonly tarifasParadasService: TarifasParadasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva tarifa para una parada' })
  @ApiResponse({ status: 201, description: 'Tarifa creada exitosamente', type: TarifasParada })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Req() req, @Body() createTarifasParadaDto: CreateTarifasParadaDto) {
    const user = req.user as JwtPayload;
    if (!user.cooperativaId) {
      throw new UnauthorizedException('No tienes una cooperativa asignada');
    }
    return this.tarifasParadasService.create(createTarifasParadaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tarifas de la cooperativa del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de tarifas de la cooperativa', type: [TarifasParada] })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(@Req() req) {
    const user = req.user as JwtPayload;
    if (!user.cooperativaId) {
      throw new UnauthorizedException('No tienes una cooperativa asignada');
    }
    return this.tarifasParadasService.findAll(user.cooperativaId);
  }

  @Get('mejores')
  @ApiOperation({ summary: 'Obtener las mejores tarifas de la cooperativa ordenadas por valor descendente' })
  @ApiResponse({ status: 200, description: 'Lista de mejores tarifas ordenadas por valor', type: [TarifasParada] })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findMejoresTarifas(@Req() req) {
    const user = req.user as JwtPayload;
    if (!user.cooperativaId) {
      throw new UnauthorizedException('No tienes una cooperativa asignada');
    }
    return this.tarifasParadasService.findMejoresTarifas(user.cooperativaId);
  }

  @Get('ruta/:rutaId')
  @ApiOperation({ summary: 'Obtener tarifas por ID de ruta' })
  @ApiResponse({ status: 200, description: 'Lista de tarifas de la ruta especificada', type: [TarifasParada] })
  @ApiResponse({ status: 404, description: 'No se encontraron tarifas para la ruta' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByRutaId(@Param('rutaId') rutaId: string) {
    return this.tarifasParadasService.findByRutaId(+rutaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tarifa por ID' })
  @ApiResponse({ status: 200, description: 'Tarifa encontrada', type: TarifasParada })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string) {
    return this.tarifasParadasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tarifa (solo tipoAsiento, valor y aplicaTarifa)' })
  @ApiResponse({ status: 200, description: 'Tarifa actualizada exitosamente', type: TarifasParada })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(@Param('id') id: string, @Body() updateTarifasParadaDto: UpdateTarifasParadaDto) {
    return this.tarifasParadasService.update(+id, updateTarifasParadaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tarifa' })
  @ApiResponse({ status: 200, description: 'Tarifa eliminada exitosamente', type: TarifasParada })
  @ApiResponse({ status: 404, description: 'Tarifa no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: string) {
    return this.tarifasParadasService.remove(+id);
  }
}
