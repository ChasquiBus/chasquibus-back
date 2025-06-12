import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResolucionesService } from './resoluciones.service';
import { CreateResolucionDto } from './dto/create-resolucion.dto';
import { UpdateResolucionDto } from './dto/update-resolucion.dto';

@Controller('resoluciones')
export class ResolucionesController {
  constructor(private readonly resolucionesService: ResolucionesService) {}

  @Post()
  create(@Body() createResolucioneDto: CreateResolucionDto) {
    return this.resolucionesService.create(createResolucioneDto);
  }

  @Get()
  findAll() {
    return this.resolucionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resolucionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResolucioneDto: UpdateResolucionDto) {
    return this.resolucionesService.update(+id, updateResolucioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resolucionesService.remove(+id);
  }
}
