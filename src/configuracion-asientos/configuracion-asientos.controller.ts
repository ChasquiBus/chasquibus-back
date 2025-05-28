import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfiguracionAsientosService } from './configuracion-asientos.service';
import { CreateConfiguracionAsientosDto } from './dto/create-configuracion-asientos.dto';
import { UpdateConfiguracionAsientosDto } from './dto/update-configuracion-asientos.dto';

@Controller('configuracion-asientos')
export class ConfiguracionAsientosController {
  constructor(private readonly service: ConfiguracionAsientosService) {}

  @Post()
  create(@Body() dto: CreateConfiguracionAsientosDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateConfiguracionAsientosDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
