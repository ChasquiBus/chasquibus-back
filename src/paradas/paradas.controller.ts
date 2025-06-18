import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ParadasService } from './paradas.service';
import { CreateParadaDto } from './dto/create-parada.dto';
import { UpdateParadaDto } from './dto/update-parada.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { Parada } from './entities/parada.entity';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { JwtPayload } from 'jsonwebtoken';

@ApiTags('paradas')
@Controller('paradas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard )
@Role( RolUsuario.ADMIN, RolUsuario.OFICINISTA)
export class ParadasController {
  constructor(private readonly paradasService: ParadasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva parada para una cooperativa' })
  @ApiResponse({ status: 201, description: 'Parada creada' })

  create(@Req() req, @Body() createParadaDto: CreateParadaDto) {
    const user = req.user as JwtPayload;
    if (!user.cooperativaId) {
      throw new UnauthorizedException('No tienes una cooperativa asignada');
    }
    return this.paradasService.create(user.cooperativaId, createParadaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene todas las paradas de la cooperativa del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de paradas', type: [Parada] })
  findAll(
    @Req() req,
    @Query('includeDeleted') includeDeleted?: string
  ) {
    const user = req.user as JwtPayload;
    if (!user.cooperativaId) {
      throw new UnauthorizedException('No tienes una cooperativa asignada');
    }
    const includeDeletedBool = includeDeleted === 'true';
    return this.paradasService.findAll(user.cooperativaId, includeDeletedBool);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener parada por ID' })
  findOne(@Param('id') id: string) {
    return this.paradasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parada' })
  update(@Param('id') id: string, @Body() updateParadaDto: UpdateParadaDto) {
    return this.paradasService.update(+id, updateParadaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar parada' })
  remove(@Param('id') id: string) {
    return this.paradasService.remove(+id);
  }
}
