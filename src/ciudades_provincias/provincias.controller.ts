import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { Ciudad } from './entities/ciudad.entity';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { Provincia } from './entities/provincia.entity';
import { ProvinciasService } from './provincias.service';

@ApiTags('provincias')
@Controller('provincias')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
export class ProvinciasController {
  constructor(
              private readonly provinciasService: ProvinciasService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas las provincias disponibles' })
  @ApiResponse({ status: 200, description: 'Listado de provincias', type: [Provincia] })
  findAllProvincias() {
    return this.provinciasService.findAllProvincias();
  }

    @Get(':id/ciudades')
    @ApiOperation({ summary: 'Lista las ciudades de una provincia específica' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de la provincia', example: 1 })
    @ApiResponse({ status: 200, description: 'Ciudades de la provincia', type: [Ciudad] })
    @ApiResponse({ status: 404, description: 'Provincia no encontrada' })
    findCiudadesByProvincia(@Param('id', ParseIntPipe) id: number) {
    return this.provinciasService.findCiudadesByProvinciaConCheck(id);
    }

 @Get(':id')
  @ApiOperation({ summary: 'Obtiene una provincia por su ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la provincia', example: 1 })
  @ApiResponse({ status: 200, description: 'Provincia encontrada', type: Provincia })
  @ApiResponse({ status: 404, description: 'Provincia no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const provincia = await this.provinciasService.findOne(id);
    if (!provincia) {
      throw new NotFoundException(`Provincia con ID ${id} no encontrada`);
    }
    return provincia;
  }
}