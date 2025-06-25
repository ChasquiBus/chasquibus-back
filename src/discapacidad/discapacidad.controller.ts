import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiscapacidadService } from './discapacidad.service';
import { CreateDiscapacidadDto } from './dto/create-discapacidad.dto';
import { UpdateDiscapacidadDto } from './dto/update-discapacidad.dto';

@Controller('discapacidad')
export class DiscapacidadController {
  constructor(private readonly discapacidadService: DiscapacidadService) {}


  @Get()
  findAll() {
    return this.discapacidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discapacidadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscapacidadDto: UpdateDiscapacidadDto) {
    return this.discapacidadService.update(+id, updateDiscapacidadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discapacidadService.remove(+id);
  }
}
