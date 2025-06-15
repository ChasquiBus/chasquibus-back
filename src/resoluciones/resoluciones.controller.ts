import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { ResolucionesService } from './resoluciones.service';
import { CreateResolucionDto } from './dto/create-resolucion.dto';
import { UpdateResolucionDto } from './dto/update-resolucion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
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
          description: 'Archivo PDF de la resolución',
          format: 'binary',
        },
        cooperativaId: {
          type: 'number',
          description: 'ID de la cooperativa a la que pertenece la resolución',
          example: 1, 
          nullable: false,
        },
        fechaEmision: {
          type: 'string',
          format: 'date',
          description: 'Fecha de emisión de la resolución',
          example: '2024-03-20',
        },
        fechaVencimiento: {
          type: 'string',
          format: 'date',
          description: 'Fecha de vencimiento de la resolución',
          example: '2025-03-20',
        },
        estado: {
          type: 'boolean',  
          description: 'Estado de la resolución (activa/inactiva)',
          default: true,
        },
        enUso: {
          type: 'boolean',
          description: 'Indica si la resolución está actualmente en uso',
          default: false,
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
  @ApiOperation({ summary: 'Obtener todas las resoluciones de una cooperativa' })
  @ApiQuery({ name: 'cooperativaId', required: true, type: Number })
  findAll(@Query('cooperativaId') cooperativaId: number) {
    return this.resolucionesService.findAll(cooperativaId);
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
          description: 'Archivo PDF de la resolución',
          nullable: true
        },
        cooperativaId: {
          type: 'number',
          description: 'ID de la cooperativa a la que pertenece la resolución',
          example: 1,
          nullable: true
        },
        fechaEmision: {
          type: 'string',
          format: 'date',
          description: 'Fecha de emisión de la resolución',
          example: '2024-03-20',
          nullable: true
        },
        fechaVencimiento: {
          type: 'string',
          format: 'date',
          description: 'Fecha de vencimiento de la resolución',
          example: '2025-03-20',
          nullable: true
        },
        estado: {
          type: 'boolean',
          description: 'Estado de la resolución (activa/inactiva)',
          example: true,
          nullable: true
        },
        enUso: {
          type: 'boolean',
          description: 'Indica si la resolución está actualmente en uso',
          example: false,
          nullable: true
        }
      }
    }
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
