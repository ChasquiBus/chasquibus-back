import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ConfiguracionAsientosService } from './configuracion-asientos.service';
import { CreateConfiguracionAsientosDto } from './dto/create-configuracion-asientos.dto';
import { UpdateConfiguracionAsientosDto } from './dto/update-configuracion-asientos.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Role } from 'auth/decorators/roles.decorator';
import { RolUsuario } from 'auth/roles.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';

@Controller('configuracion-asientos')
@ApiTags('configuracion-asientos')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
export class ConfiguracionAsientosController {
  constructor(private readonly service: ConfiguracionAsientosService) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Crear configuración de asientos' })
  @ApiResponse({
    status: 201,
    description: 'Configuración de asientos creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear la configuración de asientos',
  })
  create(@Body() dto: CreateConfiguracionAsientosDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las configuraciones de asientos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de configuraciones de asientos',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get('bus/:busId')
  @ApiOperation({ summary: 'Obtener configuración de asientos por ID de bus' })
  @ApiParam({
    name: 'busId',
    description: 'ID del bus para obtener su configuración de asientos',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Configuración de asientos del bus encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Bus no encontrado',
  })
  findByBusId(@Param('busId') busId: string) {
    return this.service.findByBusId(+busId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una configuración de asientos por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la configuración de asientos a consultar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Configuración de asientos encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Configuración de asientos no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una configuración de asientos' })
  @ApiParam({
    name: 'id',
    description: 'ID de la configuración de asientos a actualizar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Configuración de asientos actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Configuración de asientos no encontrada',
  })
  update(@Param('id') id: string, @Body() dto: UpdateConfiguracionAsientosDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una configuración de asientos' })
  @ApiParam({
    name: 'id',
    description: 'ID de la configuración de asientos a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Configuración de asientos eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Configuración de asientos no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
