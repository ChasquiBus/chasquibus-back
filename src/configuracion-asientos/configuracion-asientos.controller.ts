import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConfiguracionAsientosService } from './configuracion-asientos.service';
import { CreateConfiguracionAsientosDto } from './dto/create-configuracion-asientos.dto';
import { UpdateConfiguracionAsientosDto } from './dto/update-configuracion-asientos.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('configuracion-asientos') // Esto agrupa tus endpoints en Swagger
@Controller('configuracion-asientos')
export class ConfiguracionAsientosController {
  constructor(private readonly service: ConfiguracionAsientosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear configuración de asientos' })
  create(@Body() dto: CreateConfiguracionAsientosDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las configuraciones de asientos' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una configuración de asientos por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una configuración de asientos' })
  update(@Param('id') id: string, @Body() dto: UpdateConfiguracionAsientosDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una configuración de asientos' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
