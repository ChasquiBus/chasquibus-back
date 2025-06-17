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
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CiudadesService } from './ciudades.service';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { Ciudad } from './entities/ciudad.entity';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { JwtPayload } from 'jsonwebtoken';
import { Provincia } from './entities/provincia.entity';
import { ProvinciasService } from './provincias.service';

@ApiTags('ciudades')
@Controller('ciudades')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
export class CiudadesController {
  constructor(private readonly ciudadesService: CiudadesService,
              private readonly provinciasService: ProvinciasService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas las ciudades con su provincia' })
  @ApiResponse({ status: 200, description: 'Listado de ciudades', type: [Ciudad] })
  findAll() {
    return this.ciudadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una ciudad por su ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la ciudad', example: 3 })
  @ApiResponse({ status: 200, description: 'Ciudad encontrada', type: Ciudad })
  @ApiResponse({ status: 404, description: 'Ciudad no encontrada' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.ciudadesService.findById(id);
  }

  @Get('/provincias')
  @ApiOperation({ summary: 'Lista todas las provincias disponibles' })
  @ApiResponse({ status: 200, description: 'Listado de provincias', type: [Provincia] })
  findAllProvincias() {
    return this.provinciasService.findAllProvincias();
  }

  @Get('/provincias/:id/ciudades')
  @ApiOperation({ summary: 'Lista las ciudades de una provincia específica' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la provincia', example: 1 })
  @ApiResponse({ status: 200, description: 'Ciudades de la provincia', type: [Ciudad] })
  findCiudadesByProvincia(@Param('id', ParseIntPipe) id: number) {
    return this.provinciasService.findCiudadesByProvincia(id);
  }
}