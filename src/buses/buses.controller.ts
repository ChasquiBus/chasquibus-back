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
import { Request } from 'express';

@ApiTags('Buses')
@Controller('buses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

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
        imagen: { type: 'string', format: 'binary', description: 'Imagen del bus' },
        piso_doble: { type: 'boolean', description: 'Indica si el bus es de dos pisos' },
        total_asientos: { type: 'number', description: 'Número total de asientos del bus' },
      },
      required: ['placa', 'numero_bus', 'total_asientos']
    },
  })
  @ApiResponse({ status: 201, description: 'Bus creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'No tiene permiso para crear buses para esta cooperativa' })
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
    @Req() req: Request,
  ) {
    if (file) {
      createBusDto.imagen = file.filename;
    }
    const user = req.user as any;
    if (user.rol !== 'SUPERADMIN') {
      createBusDto.cooperativa_id = user.cooperativaTransporte.id;
    }
    return this.busesService.create(createBusDto);
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
  findAll(@Req() req: Request) {
    const user = req.user as any;
    const cooperativaId = user.rol === 'SUPERADMIN' ? undefined : user.cooperativaTransporte.id;
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
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    const cooperativaId = user.rol === 'SUPERADMIN' ? undefined : user.cooperativaTransporte.id;
    return this.busesService.findOne(+id, cooperativaId);
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ 
    summary: 'Actualizar un bus',
    description: 'Actualiza un bus específico. Los usuarios ADMIN y OFICINISTA solo pueden actualizar buses de su cooperativa. El SUPERADMIN puede actualizar cualquier bus.'
  })
  @ApiResponse({ status: 200, description: 'Bus actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Bus no encontrado' })
  @ApiResponse({ status: 403, description: 'No tiene permiso para actualizar este bus' })
  update(@Param('id') id: string, @Body() updateBusDto: UpdateBusDto, @Req() req: Request) {
    const user = req.user as any;
    const cooperativaId = user.rol === 'SUPERADMIN' ? undefined : user.cooperativaTransporte.id;
    return this.busesService.update(+id, updateBusDto, cooperativaId);
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
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    const cooperativaId = user.rol === 'SUPERADMIN' ? undefined : user.cooperativaTransporte.id;
    return this.busesService.remove(+id, cooperativaId);
  }
}
