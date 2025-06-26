import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { FrecuenciasService } from './frecuencias.service';
import { CreateFrecuenciaDto } from './dto/create-frecuencia.dto';
import { UpdateFrecuenciaDto } from './dto/update-frecuencia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('frecuencias')
@Controller('frecuencias')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FrecuenciasController {
  constructor(private readonly frecuenciasService: FrecuenciasService) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Crear una nueva frecuencia con días y tipos (operacion/parada).' })
  @ApiResponse({ status: 201, description: 'Frecuencia creada correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createFrecuenciaDto: CreateFrecuenciaDto) {
    return this.frecuenciasService.create(createFrecuenciaDto);
  }

  @Get('ruta/:rutaId')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener frecuencias por ID de ruta.' })
  @ApiParam({ name: 'rutaId', type: Number, description: 'ID de la ruta' })
  @ApiResponse({ status: 200, description: 'Lista de frecuencias para la ruta.' })
  findByRutaId(@Param('rutaId') rutaId: string) {
    return this.frecuenciasService.findAllByRutaId(+rutaId);
  }

  @Get('cooperativa')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener frecuencias para la cooperativa del usuario autenticado.' })
  @ApiResponse({ status: 200, description: 'Lista de frecuencias de la cooperativa.' })
  @ApiResponse({ status: 401, description: 'Usuario no tiene cooperativa asignada.' })
  async findAllByCooperativa(@Req() req: Request) {
    const user = req.user as JwtPayload;
    if (!user.cooperativaId) {
      throw new Error('Usuario no tiene cooperativa asignada');
    }
    return this.frecuenciasService.findAllByCooperativa(user.cooperativaId);
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener una frecuencia por su ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la frecuencia' })
  @ApiResponse({ status: 200, description: 'Frecuencia encontrada.' })
  @ApiResponse({ status: 404, description: 'Frecuencia no encontrada.' })
  findOne(@Param('id') id: string) {
    return this.frecuenciasService.findOne(+id);
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Actualizar una frecuencia por su ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la frecuencia' })
  @ApiResponse({ status: 200, description: 'Frecuencia actualizada correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  update(@Param('id') id: string, @Body() updateFrecuenciaDto: UpdateFrecuenciaDto) {
    return this.frecuenciasService.update(+id, updateFrecuenciaDto);
  }

  @Delete(':id')
  @Role(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Eliminar una frecuencia por su ID. Solo rol ADMIN.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la frecuencia' })
  @ApiResponse({ status: 200, description: 'Frecuencia eliminada correctamente.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  remove(@Param('id') id: string) {
    return this.frecuenciasService.remove(+id);
  }
}
