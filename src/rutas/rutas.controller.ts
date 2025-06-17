import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
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

@ApiTags('rutas')
@Controller('rutas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

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
        cooperativaId: { type: 'number', example: 5 },
        codigo: { type: 'string', example: 'AMB-QUI' },
        prioridad: { type: 'number', example: 1, nullable: true },
        fechaIniVigencia: { type: 'string', format: 'date', example: '2025-06-01', nullable: true },
        fechaFinVigencia: { type: 'string', format: 'date', example: '2025-12-31', nullable: true },
        estado: { type: 'boolean', example: true, nullable: true },
        file: { type: 'string', format: 'binary', description: 'PDF de la resolución' },
      },
      required: ['paradaOrigenId','paradaDestinoId','cooperativaId','codigo','file']
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createRutaDto: CreateRutaDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.rutasService.create(createRutaDto, file);
  }
}