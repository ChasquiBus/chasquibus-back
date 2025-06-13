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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { BusesService } from './buses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { Role } from 'auth/decorators/roles.decorator';
import { RolUsuario } from 'auth/roles.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Buses')
@Controller('buses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Crear un nuevo bus' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cooperativa_id: { type: 'number', description: 'ID de la cooperativa' },
        placa: { type: 'string', description: 'Placa del bus' },
        numero_bus: { type: 'string', description: 'Número del bus' },
        marca_chasis: { type: 'string', description: 'Marca del chasis' },
        marca_carroceria: { type: 'string', description: 'Marca de la carrocería' },
        imagen: { type: 'string', format: 'binary', description: 'Imagen del bus' },
        piso_doble: { type: 'boolean', description: 'Indica si el bus es de dos pisos' },
        total_asientos: { type: 'number', description: 'Número total de asientos del bus' },
      },
      required: ['cooperativa_id', 'placa', 'numero_bus', 'total_asientos']
    },
  })
  @ApiResponse({ status: 201, description: 'Bus creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './upload/buses',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBusDto: CreateBusDto,
  ) {
    if (file) {
      createBusDto.imagen = file.filename;
    }
    return this.busesService.create(createBusDto);
  }

  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener todos los buses' })
  @ApiResponse({ status: 200, description: 'Lista de buses obtenida exitosamente' })
  findAll() {
    return this.busesService.findAll();
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener un bus por ID' })
  @ApiResponse({ status: 200, description: 'Bus encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Bus no encontrado' })
  findOne(@Param('id') id: string) {
    return this.busesService.findOne(+id);
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Actualizar un bus' })
  @ApiResponse({ status: 200, description: 'Bus actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Bus no encontrado' })
  update(@Param('id') id: string, @Body() updateBusDto: UpdateBusDto) {
    return this.busesService.update(+id, updateBusDto);
  }

  @Delete(':id')
  @Role(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Eliminar un bus' })
  @ApiResponse({ status: 200, description: 'Bus eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Bus no encontrado' })
  remove(@Param('id') id: string) {
    return this.busesService.remove(+id);
  }
}
