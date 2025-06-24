import { 
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, ParseIntPipe, Request 
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
import { HojaTrabajoDetalladaDto } from './dto/hoja-trabajo-detallada.dto';

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


  @Get("viajes")
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Listar todas los viajes [programado]  o [en curso] con información detallada para movil' })
  async getAll(): Promise<{ message: string, data: HojaTrabajoDetalladaDto[], count: number }> {
    return this.hojaTrabajoService.getAll();
  }

  @Get('viaje/:id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener hoja de trabajo detallada por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.hojaTrabajoService.getById(id);
  }

  
  @Get('estado/:estado')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Buscar por estado' })
  @ApiParam({ name: 'estado', enum: EstadoHojaTrabajo })
  findByEstado(@Param('estado') estado: string) {
    return this.hojaTrabajoService.findByEstado(estado);
  }


  @Get('cooperativa/mis-hojas')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Listar hojas de trabajo de la cooperativa del usuario autenticado' })
  async findByCooperativaId(@Request() req: any) {
    // Se asume que el cooperativaId está en req.user.cooperativaId
    const cooperativaId = req.user?.cooperativaId;
    if (!cooperativaId) {
      return { message: 'No se encontró cooperativaId en el token', data: [], count: 0 };
    }
    return this.hojaTrabajoService.findByCooperativaId(cooperativaId);
  }

  @Get('chofer/mis-programadas')
  @Role(RolUsuario.CHOFER)
  @ApiOperation({ summary: 'Listar hojas de trabajo programadas para el chofer autenticado' })
  async findProgramadasByChoferId(@Request() req: any) {
    // Se asume que el id de usuario está en req.user.sub
    const userId = req.user?.sub;
    if (!userId) {
      return { message: 'No se encontró el id de usuario en el token', data: [], count: 0 };
    }
    return this.hojaTrabajoService.findProgramadasByChoferId(userId);
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

}
