import { 
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, ParseIntPipe 
} from '@nestjs/common';
import { 
  ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody 
} from '@nestjs/swagger';
import { HojaTrabajoService } from './hoja-trabajo.service';
import { CreateHojaTrabajoDto } from './dto/create-hoja-trabajo.dto';
import { UpdateHojaTrabajoDto } from './dto/update-hoja-trabajo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { EstadoHojaTrabajo } from './dto/create-hoja-trabajo.dto';

@ApiTags('Hojas de Trabajo')
@ApiBearerAuth('access-token')
@Controller('hoja-trabajo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HojaTrabajoController {
  constructor(private readonly hojaTrabajoService: HojaTrabajoService) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Crear una hoja de trabajo' })
  @ApiBody({ type: CreateHojaTrabajoDto })
  create(@Body() dto: CreateHojaTrabajoDto) {
    return this.hojaTrabajoService.create(dto);
  }

  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Listar todas las hojas de trabajo' })
  findAll() {
    return this.hojaTrabajoService.findAll();
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener hoja de trabajo por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hojaTrabajoService.findOne(id);
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Actualizar hoja de trabajo' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateHojaTrabajoDto })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateHojaTrabajoDto
  ) {
    return this.hojaTrabajoService.update(id, dto);
  }

  @Delete(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Eliminar hoja de trabajo' })
  @ApiParam({ name: 'id', type: 'number' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hojaTrabajoService.remove(id);
  }

  @Get('bus/:busId')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Buscar por bus' })
  @ApiParam({ name: 'busId', type: 'number' })
  findByBus(@Param('busId', ParseIntPipe) busId: number) {
    return this.hojaTrabajoService.findByBus(busId);
  }

  @Get('chofer/:choferId')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Buscar por chofer' })
  @ApiParam({ name: 'choferId', type: 'number' })
  findByChofer(@Param('choferId', ParseIntPipe) choferId: number) {
    return this.hojaTrabajoService.findByChofer(choferId);
  }

  @Get('estado/:estado')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Buscar por estado' })
  @ApiParam({ name: 'estado', enum: EstadoHojaTrabajo })
  findByEstado(@Param('estado') estado: string) {
    return this.hojaTrabajoService.findByEstado(estado);
  }
}
