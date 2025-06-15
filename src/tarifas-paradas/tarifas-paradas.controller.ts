import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TarifasParadasService } from './tarifas-paradas.service';
import { CreateTarifasParadaDto } from './dto/create-tarifas-parada.dto';
import { UpdateTarifasParadaDto } from './dto/update-tarifas-parada.dto';

@Controller('tarifas-paradas')
export class TarifasParadasController {
  constructor(private readonly tarifasParadasService: TarifasParadasService) {}

  @Post()
  create(@Body() createTarifasParadaDto: CreateTarifasParadaDto) {
    return this.tarifasParadasService.create(createTarifasParadaDto);
  }

  @Get()
  findAll() {
    return this.tarifasParadasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tarifasParadasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTarifasParadaDto: UpdateTarifasParadaDto) {
    return this.tarifasParadasService.update(+id, updateTarifasParadaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tarifasParadasService.remove(+id);
  }
}
