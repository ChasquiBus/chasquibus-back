import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParadasService } from './paradas.service';
import { CreateParadaDto } from './dto/create-parada.dto';
import { UpdateParadaDto } from './dto/update-parada.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('paradas')
@Controller('paradas')
export class ParadasController {
  constructor(private readonly paradasService: ParadasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva parada' })
  @ApiResponse({ status: 201, description: 'Parada creada' })
  create(@Body() createParadaDto: CreateParadaDto) {
    return this.paradasService.create(createParadaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las paradas con ciudad' })
  findAll() {
    return this.paradasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener parada por ID' })
  findOne(@Param('id') id: string) {
    return this.paradasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parada' })
  update(@Param('id') id: string, @Body() updateParadaDto: UpdateParadaDto) {
    return this.paradasService.update(+id, updateParadaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar parada' })
  remove(@Param('id') id: string) {
    return this.paradasService.remove(+id);
  }
}
