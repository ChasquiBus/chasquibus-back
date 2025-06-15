import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { JwtPayload } from 'jsonwebtoken';

@ApiTags('rutas')
@Controller('rutas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Crear una nueva ruta' })
  @ApiResponse({ status: 201, description: 'Ruta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createRutaDto: CreateRutaDto) {
    return this.rutasService.create(createRutaDto);
  }

  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener todas las rutas de la cooperativa del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de rutas obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No tienes una cooperativa asignada' })
  findAll(@Req() req) {
    const user = req.user as JwtPayload;
    if (!user.cooperativaId) {
      throw new UnauthorizedException('No tienes una cooperativa asignada');
    }
    return this.rutasService.findAll(user.cooperativaId);
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener una ruta específica' })
  @ApiResponse({ status: 200, description: 'Ruta encontrada exitosamente' })
  @ApiResponse({ status: 404, description: 'Ruta no encontrada' })
  findOne(@Param('id') id: string) {
    return this.rutasService.findOne(+id);
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Actualizar una ruta' })
  @ApiResponse({ status: 200, description: 'Ruta actualizada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Ruta no encontrada' })
  update(@Param('id') id: string, @Body() updateRutaDto: UpdateRutaDto) {
    return this.rutasService.update(+id, updateRutaDto);
  }

  @Delete(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Eliminar una ruta' })
  @ApiResponse({ status: 200, description: 'Ruta eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Ruta no encontrada' })
  remove(@Param('id') id: string) {
    return this.rutasService.remove(+id);
  }
}