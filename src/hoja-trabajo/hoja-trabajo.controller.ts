import { 
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, ParseIntPipe, Request, 
  Query
} from '@nestjs/common';
import { 
  ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiQuery
} from '@nestjs/swagger';
import { HojaTrabajoService } from './hoja-trabajo.service';
import { CreateHojaTrabajoDto } from './dto/create-hoja-trabajo.dto';
import { UpdateHojaTrabajoDto } from './dto/update-hoja-trabajo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { EstadoHojaTrabajo } from './dto/create-hoja-trabajo.dto';
import { FiltroViajeDto, HojaTrabajoDetalladaDto } from './dto/hoja-trabajo-detallada.dto';
import { CrearHojaTrabajoService } from './crear-hoja-trabajo.service';

@ApiTags('Hojas de Trabajo')
@ApiBearerAuth('access-token')
@Controller('hoja-trabajo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HojaTrabajoController {
  constructor(private readonly hojaTrabajoService: HojaTrabajoService,
              private readonly crearHojaTrabajoService: CrearHojaTrabajoService
  ) {}

  @Post('crear/automaticamente')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Crear una hoja de trabajo' })
  @ApiBody({ type: CreateHojaTrabajoDto })
  createAutomatically(@Body() dto: CreateHojaTrabajoDto) {
    return this.crearHojaTrabajoService.createAutomatically(dto);
  }

    @Post('crear/manualmente')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Crear una hoja de trabajo' })
  @ApiBody({ type: CreateHojaTrabajoDto })
  createManual(@Body() dto: CreateHojaTrabajoDto) {
    return this.hojaTrabajoService.createManual(dto);
  }


  @Get("viajes")
  @Role(RolUsuario.CLIENTE, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Listar viajes con información detallada, filtrados OPCIONALMENTE por estado, si no envia nada lista ambos' })
  async getAll(@Query() filtro: FiltroViajeDto) {
    return this.hojaTrabajoService.getAll(filtro.estado);
  }

  @Get('viaje/:id')
  @Role(RolUsuario.CLIENTE, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener hoja de trabajo detallada por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.hojaTrabajoService.getById(id);
  }

  
  @Get('estado/:estado')
  @Role(RolUsuario.CLIENTE, RolUsuario.OFICINISTA, RolUsuario.CHOFER)
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

  @Get('buscar-por-ciudades')
  @Role( RolUsuario.CHOFER, RolUsuario.CLIENTE)
  @ApiOperation({ summary: 'Buscar hojas de trabajo por ciudades de origen y destino' })
  @ApiQuery({ name: 'ciudadOrigen', description: 'Código de la ciudad de origen' })
  @ApiQuery({ name: 'ciudadDestino', description: 'Código de la ciudad de destino' })
  async findByCiudades(
    @Query('ciudadOrigen') ciudadOrigen: string,
    @Query('ciudadDestino') ciudadDestino: string
  ) {
    console.log(ciudadOrigen)
    if (!ciudadOrigen || !ciudadDestino) {
      return { 
        message: 'Se requieren los parámetros ciudadOrigen y ciudadDestino', 
        data: [], 
        count: 0 
      };
    }
    return this.hojaTrabajoService.findByCiudades(ciudadOrigen, ciudadDestino);
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
