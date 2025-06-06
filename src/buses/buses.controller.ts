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
import { ApiBearerAuth } from '@nestjs/swagger';


@Controller('buses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard )
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './upload/buses', //carpeta para cargar las imagenes de  los buses
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
      createBusDto.imagen = file.filename; // o usa file.path si prefieres la ruta completa
    }
    // También podrías convertir aquí cooperativa_id, chofer_id, piso_doble si lo necesitas
    return this.busesService.create(createBusDto);
  }

  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  findAll() {
    return this.busesService.findAll();
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  findOne(@Param('id') id: string) {
    return this.busesService.findOne(+id);
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  update(@Param('id') id: string, @Body() updateBusDto: UpdateBusDto) {
    return this.busesService.update(+id, updateBusDto);
  }

  @Delete(':id')
  @Role(RolUsuario.ADMIN)
  remove(@Param('id') id: string) {
    return this.busesService.remove(+id);
  }
}
