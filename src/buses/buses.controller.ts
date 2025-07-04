import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';

import { BusesService } from './buses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { Role } from 'auth/decorators/roles.decorator';
import { RolUsuario } from 'auth/roles.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { CooperativasService } from '../cooperativas/cooperativas.service';

// Funciones auxiliares para conversión robusta fuera de la clase
function parseBoolean(value: any) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
}

function parseNumber(value: any) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value);
  return undefined;
}

@ApiTags('Buses')
@Controller('buses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusesController {
  constructor(
    private readonly busesService: BusesService,
    private readonly cooperativasService: CooperativasService,
  ) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ 
    summary: 'Crear un nuevo bus',
    description: 'Crea un nuevo bus para la cooperativa del usuario. Los usuarios ADMIN y OFICINISTA solo pueden crear buses para su propia cooperativa. El SUPERADMIN puede crear buses para cualquier cooperativa.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cooperativa_id: { 
          type: 'number', 
          description: 'ID de la cooperativa. Para ADMIN y OFICINISTA, este valor será ignorado y se usará su cooperativa asignada. Solo el SUPERADMIN puede especificar una cooperativa diferente.' 
        },
        placa: { type: 'string', description: 'Placa del bus' },
        numero_bus: { type: 'string', description: 'Número del bus' },
        marca_chasis: { type: 'string', description: 'Marca del chasis' },
        marca_carroceria: { type: 'string', description: 'Marca de la carrocería' },
        imagen: { type: 'string', format: 'binary', description: 'Imagen del bus (archivo)' },
        piso_doble: { type: 'boolean', description: 'Indica si el bus es de dos pisos' },
        total_asientos: { type: 'number', description: 'Número total de asientos del bus' },
        total_asientos_piso2: { type: 'number', description: 'Número total de asientos en el segundo piso (solo si el bus es de dos pisos)', nullable: true }
      },
      required: ['placa', 'numero_bus', 'total_asientos']
    },
  })
  @ApiResponse({ status: 201, description: 'Bus creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'No tiene permiso para crear buses para esta cooperativa' })
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: memoryStorage(),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBusDto: any,
    @Req() req: Request,
  ) {
    if ('piso_doble' in createBusDto) createBusDto.piso_doble = parseBoolean(createBusDto.piso_doble);
    if ('activo' in createBusDto) createBusDto.activo = parseBoolean(createBusDto.activo);
    if ('cooperativa_id' in createBusDto) createBusDto.cooperativa_id = parseNumber(createBusDto.cooperativa_id);
    if ('total_asientos' in createBusDto) createBusDto.total_asientos = parseNumber(createBusDto.total_asientos);
    if ('total_asientos_piso2' in createBusDto) createBusDto.total_asientos_piso2 = parseNumber(createBusDto.total_asientos_piso2);
    const user = req.user as any;
    if (user.rol !== 'SUPERADMIN') {
      if (!user.cooperativaId) {
        throw new Error('El usuario no tiene cooperativa asignada');
      }
      createBusDto.cooperativa_id = user.cooperativaId;
    }
    return this.busesService.create(createBusDto, file);
  }

  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ 
    summary: 'Obtener todos los buses',
    description: 'Obtiene la lista de buses. Los usuarios ADMIN y OFICINISTA solo verán los buses de su cooperativa. El SUPERADMIN verá todos los buses.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de buses obtenida exitosamente. Los usuarios ADMIN y OFICINISTA solo verán los buses de su cooperativa.' 
  })
  async findAll(@Req() req: Request) {
    const user = req.user as any;
    let cooperativaId: number | undefined = undefined;
    if (user.rol !== 'SUPERADMIN') {
      if (user.cooperativaTransporte && user.cooperativaTransporte.id) {
        cooperativaId = user.cooperativaTransporte.id;
      } else if (user.usuarioCooperativaId) {
        const cooperativa = await this.cooperativasService.findCooperativaByUsuarioCooperativaId(user.usuarioCooperativaId);
        if (!cooperativa) {
          throw new Error('No se encontró la cooperativa para este usuario');
        }
        cooperativaId = cooperativa.id;
      } else if (user.sub || user.id) {
        const usuarioId = user.sub || user.id;
        const cooperativa = await this.cooperativasService.findCooperativaByUsuarioId(usuarioId);
        if (!cooperativa) {
          throw new Error('No se encontró la cooperativa para este usuario');
        }
        cooperativaId = cooperativa.id;
      } else {
        throw new Error('El usuario no tiene cooperativa asignada');
      }
    }
    return this.busesService.findAll(cooperativaId);
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ 
    summary: 'Obtener un bus por ID',
    description: 'Obtiene un bus específico por su ID. Los usuarios ADMIN y OFICINISTA solo pueden ver buses de su cooperativa. El SUPERADMIN puede ver cualquier bus.'
  })
  @ApiResponse({ status: 200, description: 'Bus encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Bus no encontrado' })
  @ApiResponse({ status: 403, description: 'No tiene permiso para ver este bus' })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    let cooperativaId: number | undefined = undefined;
    if (user.rol !== 'SUPERADMIN') {
      if (user.cooperativaTransporte && user.cooperativaTransporte.id) {
        cooperativaId = user.cooperativaTransporte.id;
      } else if (user.usuarioCooperativaId) {
        const cooperativa = await this.cooperativasService.findCooperativaByUsuarioCooperativaId(user.usuarioCooperativaId);
        if (!cooperativa) throw new NotFoundException('No se encontró la cooperativa para este usuario');
        cooperativaId = cooperativa.id;
      } else if (user.sub || user.id) {
        const usuarioId = user.sub || user.id;
        const cooperativa = await this.cooperativasService.findCooperativaByUsuarioId(usuarioId);
        if (!cooperativa) throw new NotFoundException('No se encontró la cooperativa para este usuario');
        cooperativaId = cooperativa.id;
      } else {
        throw new NotFoundException('El usuario no tiene cooperativa asignada');
      }
    }
    const bus = await this.busesService.findOne(+id, cooperativaId);
    if (!bus) throw new NotFoundException('Bus no encontrado');
    return bus;
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ 
    summary: 'Actualizar un bus',
    description: 'Actualiza un bus específico. Los usuarios ADMIN y OFICINISTA solo pueden actualizar buses de su cooperativa. El SUPERADMIN puede actualizar cualquier bus. Se deben proporcionar al menos un campo para actualizar.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        placa: { type: 'string', description: 'Placa del bus' },
        numero_bus: { type: 'string', description: 'Número del bus' },
        marca_chasis: { type: 'string', description: 'Marca del chasis' },
        marca_carroceria: { type: 'string', description: 'Marca de la carrocería' },
        imagen: { type: 'string', format: 'binary', description: 'Imagen del bus (archivo)', nullable: true },
        piso_doble: { type: 'boolean', description: 'Indica si el bus es de dos pisos' },
        total_asientos: { type: 'number', description: 'Número total de asientos del bus' },
        activo: { type: 'boolean', description: 'Indica si el bus está activo' },
        total_asientos_piso2: { type: 'number', description: 'Número total de asientos en el segundo piso (solo si el bus es de dos pisos)', nullable: true }
      },
      required: []
    }
  })
  @ApiResponse({ status: 200, description: 'Bus actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'No se proporcionaron valores para actualizar' })
  @ApiResponse({ status: 404, description: 'Bus no encontrado' })
  @ApiResponse({ status: 403, description: 'No tiene permiso para actualizar este bus' })
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: memoryStorage(),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateBusDto: any,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if ('piso_doble' in updateBusDto) updateBusDto.piso_doble = parseBoolean(updateBusDto.piso_doble);
    if ('activo' in updateBusDto) updateBusDto.activo = parseBoolean(updateBusDto.activo);
    if ('cooperativa_id' in updateBusDto) updateBusDto.cooperativa_id = parseNumber(updateBusDto.cooperativa_id);
    if ('total_asientos' in updateBusDto) updateBusDto.total_asientos = parseNumber(updateBusDto.total_asientos);
    if ('total_asientos_piso2' in updateBusDto) updateBusDto.total_asientos_piso2 = parseNumber(updateBusDto.total_asientos_piso2);
    const user = req.user as any;
    let cooperativaId: number | undefined = undefined;
    if (user.rol !== 'SUPERADMIN') {
      if (!user.cooperativaId) {
        throw new Error('El usuario no tiene cooperativa asignada');
      }
      cooperativaId = user.cooperativaId;
    }
    return this.busesService.update(+id, updateBusDto, cooperativaId, file);
  }

  @Delete(':id')
  @Role(RolUsuario.ADMIN)
  @ApiOperation({ 
    summary: 'Eliminar un bus',
    description: 'Elimina un bus específico. Los usuarios ADMIN solo pueden eliminar buses de su cooperativa. El SUPERADMIN puede eliminar cualquier bus.'
  })
  @ApiResponse({ status: 200, description: 'Bus eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Bus no encontrado' })
  @ApiResponse({ status: 403, description: 'No tiene permiso para eliminar este bus' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    let cooperativaId: number | undefined = undefined;
    if (user.rol !== 'SUPERADMIN') {
      if (user.cooperativaTransporte && user.cooperativaTransporte.id) {
        cooperativaId = user.cooperativaTransporte.id;
      } else if (user.usuarioCooperativaId) {
        const cooperativa = await this.cooperativasService.findCooperativaByUsuarioCooperativaId(user.usuarioCooperativaId);
        if (!cooperativa) throw new NotFoundException('No se encontró la cooperativa para este usuario');
        cooperativaId = cooperativa.id;
      } else if (user.sub || user.id) {
        const usuarioId = user.sub || user.id;
        const cooperativa = await this.cooperativasService.findCooperativaByUsuarioId(usuarioId);
        if (!cooperativa) throw new NotFoundException('No se encontró la cooperativa para este usuario');
        cooperativaId = cooperativa.id;
      } else {
        throw new NotFoundException('El usuario no tiene cooperativa asignada');
      }
    }
    return this.busesService.remove(+id, cooperativaId);
  }
}

