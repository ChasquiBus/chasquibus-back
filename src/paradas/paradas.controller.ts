import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParadasService } from './paradas.service';
import { CreateParadaDto } from './dto/create-parada.dto';
import { UpdateParadaDto } from './dto/update-parada.dto';

@Controller('paradas')
export class ParadasController {
  constructor(private readonly paradasService: ParadasService) {}

  @Post()
  create(@Body() createParadaDto: CreateParadaDto) {
    return this.paradasService.create(createParadaDto);
  }

  @Get()
  findAll() {
    return this.paradasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paradasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParadaDto: UpdateParadaDto) {
    return this.paradasService.update(+id, updateParadaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paradasService.remove(+id);
  }
}
