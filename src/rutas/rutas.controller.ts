import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, UnauthorizedException, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { JwtPayload } from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@ApiTags('rutas')
@Controller('rutas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RutasController {
  constructor(private readonly rutasService: RutasService,
  ) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Crear una nueva ruta con PDF de resolución' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paradaOrigenId: { type: 'number', example: 1 },
        paradaDestinoId: { type: 'number', example: 2 },
        prioridad: { type: 'number', example: 1, nullable: true },
        esDirecto: { type: 'boolean', example: false, nullable: true },
        fechaIniVigencia: { type: 'string', format: 'date', example: '2025-06-01', nullable: true },
        fechaFinVigencia: { type: 'string', format: 'date', example: '2025-12-31', nullable: true },
        estado: { type: 'boolean', example: true, nullable: true },
        diasOperacion: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              diaId: { type: 'number', example: 1 },
              tipo: { type: 'string', example: 'operacion' }
            }
          },
          example: [
            { diaId: 1, tipo: 'operacion' },
            { diaId: 2, tipo: 'parada' },
            { diaId: 3, tipo: 'operacion' },
            { diaId: 4, tipo: 'parada' },
            { diaId: 5, tipo: 'operacion' },
            { diaId: 6, tipo: 'operacion' },
            { diaId: 7, tipo: 'parada' }
          ]
        },
        file: { type: 'string', format: 'binary', description: 'PDF de la resolución' },
      },
      required: ['paradaOrigenId', 'paradaDestinoId', 'diasOperacion', 'file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const user = req.user;
    if (!user.cooperativaId) {
      throw new Error('No tienes una cooperativa asignada');
    }
  
    try {
      // Parsear JSON del campo diasOperacion
      if (typeof body.diasOperacion === 'string') {
        body.diasOperacion = JSON.parse(body.diasOperacion);
      }
      // Convertir 'estado' a booleano si viene como string
      if (typeof body.estado === 'string') {
        body.estado = body.estado === 'true';
      }
      // Convertir 'esDirecto' a booleano si viene como string
      if (typeof body.esDirecto === 'string') {
        body.esDirecto = body.esDirecto === 'true';
      }
      // Convertir a instancia de DTO y validar
      const createRutaDto = plainToInstance(CreateRutaDto, body);
      await validateOrReject(createRutaDto);
  
      return await this.rutasService.create(user.cooperativaId, createRutaDto, file);
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Datos inválidos en el formulario, revisa los campos enviados.');
    }
  }
@Get()
@Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
@ApiOperation({ summary: 'Obtener todas las rutas de la cooperativa del usuario' })
async getAll(@Req() req: any) {
  const user = req.user;
  if (!user.cooperativaId) {
    throw new Error('No tienes una cooperativa asignada');
  }
  return await this.rutasService.getAll(user.cooperativaId);
}

@Get('todas')
@Role(RolUsuario.CLIENTE, RolUsuario.OFICINISTA, RolUsuario.CHOFER)
@ApiOperation({ summary: 'Listar todas las rutas activas (sin cooperativa)' })
async getAllPublic() {
  return await this.rutasService.getAllPublic();
}

@Get(':id')
@Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
@ApiOperation({ summary: 'Obtener una ruta específica de la cooperativa del usuario' })
async getOne(@Param('id') id: number, @Req() req: any) {
  const user = req.user;
  if (!user.cooperativaId) {
    throw new Error('No tienes una cooperativa asignada');
  }
  return await this.rutasService.getOne(user.cooperativaId, id);
}

@Delete(':id')
@Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
@ApiOperation({ summary: 'Eliminar lógicamente una ruta de la cooperativa del usuario' })
async delete(@Param('id') id: number, @Req() req: any) {
  const user = req.user;
  if (!user.cooperativaId) {
    throw new Error('No tienes una cooperativa asignada');
  }
  return await this.rutasService.delete(user.cooperativaId, id);
}

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Actualizar una ruta de la cooperativa del usuario' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paradaOrigenId: { type: 'number', example: 1, nullable: true },
        paradaDestinoId: { type: 'number', example: 2, nullable: true },
        prioridad: { type: 'number', example: 1, nullable: true },
        esDirecto: { type: 'boolean', example: false, nullable: true },
        fechaIniVigencia: { type: 'string', format: 'date', example: '2025-06-01', nullable: true },
        fechaFinVigencia: { type: 'string', format: 'date', example: '2025-12-31', nullable: true },
        estado: { type: 'boolean', example: true, nullable: true },
        diasOperacion: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              diaId: { type: 'number', example: 1 },
              tipo: { type: 'string', example: 'operacion' }
            }
          },
          example: [
            { diaId: 1, tipo: 'operacion' },
            { diaId: 7, tipo: 'parada' }
          ]
        },
        file: { type: 'string', format: 'binary', description: 'PDF de la resolución', nullable: true },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number,
    @Body() body: any, // usamos any aquí para parsear manualmente
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const user = req.user;
    if (!user.cooperativaId) {
      throw new Error('No tienes una cooperativa asignada');
    }

    // ✅ Transformar campos JSON y tipos
    if (typeof body.diasOperacion === 'string') {
      try {
        body.diasOperacion = JSON.parse(body.diasOperacion);
      } catch (e) {
        throw new BadRequestException('El campo diasOperacion no tiene un formato JSON válido');
      }
    }

    // ✅ Transformar a tipos correctos si vienen como string
    if (body.paradaOrigenId) body.paradaOrigenId = Number(body.paradaOrigenId);
    if (body.paradaDestinoId) body.paradaDestinoId = Number(body.paradaDestinoId);
    if (body.prioridad) body.prioridad = Number(body.prioridad);
    if (body.estado != null) body.estado = body.estado === 'true' || body.estado === true;

    // ✅ Convertir a instancia de DTO (para validación y transformación)
    const updateRutaDto = plainToInstance(UpdateRutaDto, body);

    return await this.rutasService.update(user.cooperativaId, id, updateRutaDto, file);
  }
}