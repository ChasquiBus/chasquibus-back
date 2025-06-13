import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ParadasService } from './paradas.service';
import { CreateParadaDto } from './dto/create-parada.dto';
import { UpdateParadaDto } from './dto/update-parada.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { Parada } from './entities/parada.entity';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';

@ApiTags('paradas')
@Controller('paradas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard )
@Role( RolUsuario.SUPERADMIN, RolUsuario.OFICINISTA)
export class ParadasController {
  constructor(private readonly paradasService: ParadasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva parada' })
  @ApiResponse({ status: 201, description: 'Parada creada' })
  create(@Body() createParadaDto: CreateParadaDto) {
    return this.paradasService.create(createParadaDto);
  }

  @Get(':cooperativaId')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtiene todas las paradas de una cooperativa específica' })
  @ApiResponse({ status: 200, description: 'Lista de paradas', type: [Parada] })
  findAll(
    @Param('cooperativaId', ParseIntPipe) cooperativaId: number,
    @Query('includeDeleted') includeDeleted?: string
  ) {
    const includeDeletedBool = includeDeleted === 'true';
    return this.paradasService.findAll(cooperativaId, includeDeletedBool);
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
