import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CiudadesService } from './ciudades.service';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';

@Controller('ciudades')
export class CiudadesController {
  constructor(private readonly ciudadesService: CiudadesService) {}

  @Post()
  create(@Body() createCiudadeDto: CreateCiudadDto) {
    return this.ciudadesService.create(createCiudadeDto);
  }

  @Get()
  findAll() {
    return this.ciudadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ciudadesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCiudadeDto: UpdateCiudadDto) {
    return this.ciudadesService.update(+id, updateCiudadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ciudadesService.remove(+id);
  }
}
