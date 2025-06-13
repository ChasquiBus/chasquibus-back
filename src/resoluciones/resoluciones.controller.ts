import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ResolucionesService } from './resoluciones.service';
import { CreateResolucionDto } from './dto/create-resolucion.dto';
import { UpdateResolucionDto } from './dto/update-resolucion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { Role } from 'auth/decorators/roles.decorator';
import { RolUsuario } from 'auth/roles.enum';

@Controller('resoluciones')
@ApiTags('resoluciones')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResolucionesController {
  constructor(private readonly resolucionesService: ResolucionesService) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Crear una nueva resolución' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        cooperativaId: {
          type: 'number',
        },
        fechaEmision: {
          type: 'string',
          format: 'date',
        },
        fechaVencimiento: {
          type: 'string',
          format: 'date',
        },
        estado: {
          type: 'boolean',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createResolucionDto: CreateResolucionDto, @UploadedFile() file: Express.Multer.File) {
    return this.resolucionesService.create(createResolucionDto, file);
  }

  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener todas las resoluciones' })
  findAll() {
    return this.resolucionesService.findAll();
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener una resolución por ID' })
  findOne(@Param('id') id: string) {
    return this.resolucionesService.findOne(+id);
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Actualizar una resolución' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        cooperativaId: {
          type: 'number',
        },
        fechaEmision: {
          type: 'string',
          format: 'date',
        },
        fechaVencimiento: {
          type: 'string',
          format: 'date',
        },
        estado: {
          type: 'boolean',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateResolucionDto: UpdateResolucionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.resolucionesService.update(+id, updateResolucionDto, file);
  }

  @Delete(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Eliminar una resolución' })
  remove(@Param('id') id: string) {
    return this.resolucionesService.remove(+id);
  }
}
