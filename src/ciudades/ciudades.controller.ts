import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CiudadesService } from './ciudades.service';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { Ciudad } from './entities/ciudad.entity';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';

@ApiTags('ciudades') 
@Controller('ciudades')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard )
@Role( RolUsuario.SUPERADMIN, RolUsuario.OFICINISTA)
export class CiudadesController {
  constructor(private readonly ciudadesService: CiudadesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva ciudad' })
  @ApiResponse({
    status: 201,
    description: 'Ciudad creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear la ciudad',
  })
  create(@Body() createCiudadDto: CreateCiudadDto) {
    return this.ciudadesService.create(createCiudadDto);
  }

  @Get(':cooperativaId')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtiene todas las ciudades de una cooperativa específica' })
  @ApiResponse({ status: 200, description: 'Lista de ciudades', type: [Ciudad] })
  findAll(
    @Param('cooperativaId', ParseIntPipe) cooperativaId: number
  ) {
    return this.ciudadesService.findAll(cooperativaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una ciudad por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la ciudad a consultar', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Ciudad encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Ciudad no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.ciudadesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una ciudad existente' })
  @ApiParam({ name: 'id', description: 'ID de la ciudad a actualizar', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Ciudad actualizada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Ciudad no encontrada',
  })
  update(@Param('id') id: string, @Body() updateCiudadDto: UpdateCiudadDto) {
    return this.ciudadesService.update(+id, updateCiudadDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una ciudad' })
  @ApiParam({ name: 'id', description: 'ID de la ciudad a eliminar', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Ciudad eliminada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Ciudad no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.ciudadesService.remove(+id);
  }
}
