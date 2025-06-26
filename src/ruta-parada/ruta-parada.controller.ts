import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { RutaParadaService } from './ruta-parada.service';
import { CreateRutaParadaDto } from './dto/create-ruta-parada.dto';
import { UpdateRutaParadaDto } from './dto/update-ruta-parada.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';

@ApiTags('ruta-parada')
@Controller('ruta-parada')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RutaParadaController {
  constructor(private readonly rutaParadaService: RutaParadaService) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Crear una nueva parada en una ruta' })
  @ApiResponse({ status: 201, description: 'Parada creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe una parada con este orden en la ruta' })
  create(@Body() createRutaParadaDto: CreateRutaParadaDto) {
    return this.rutaParadaService.create(createRutaParadaDto);
  }

    @Get('by-cooperativa')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener todas las rutas paradas de la cooperativa del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de rutas paradas obtenida exitosamente' })
  @ApiResponse({ status: 400, description: 'No tienes una cooperativa asignada' })
  async findAllByCooperativa(@Req() req: any) {
    const user = req.user;
    if (!user.cooperativaId) {
      throw new BadRequestException('No tienes una cooperativa asignada');
    }
    return this.rutaParadaService.findAllParadasByCooperativa(user.cooperativaId);
  }

  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener todas las paradas de una ruta' })
  @ApiResponse({ status: 200, description: 'Lista de paradas obtenida exitosamente' })
  @ApiResponse({ status: 400, description: 'ID de ruta no proporcionado' })
  findAll(@Query('rutaId') rutaId: number) {
    return this.rutaParadaService.findAllParadasFromRutas(rutaId);
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener una parada específica ' })
  @ApiResponse({ status: 200, description: 'Parada encontrada exitosamente' })
  @ApiResponse({ status: 404, description: 'Parada no encontrada' })
  findOne(@Param('id') id: string) {
    return this.rutaParadaService.findOne(+id);
  }

/* 

@Patch(':id/no-habilites-esta-mija-porfa')
 @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Actualizar una parada de una ruta' })
  @ApiResponse({ status: 200, description: 'Parada actualizada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Parada no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe una parada con este orden en la ruta' })
  update(@Param('id') id: string, @Body() updateRutaParadaDto: UpdateRutaParadaDto) {
    return this.rutaParadaService.update(+id, updateRutaParadaDto);
  }
*/

  @Delete(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Eliminar una parada de una ruta' })
  @ApiResponse({ status: 200, description: 'Parada eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Parada no encontrada' })
  remove(@Param('id') id: string) {
    return this.rutaParadaService.remove(+id);
  }
} 