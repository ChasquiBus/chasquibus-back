import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { FrecuenciasService } from './frecuencias.service';
import { CreateFrecuenciaDto } from './dto/create-frecuencia.dto';
import { UpdateFrecuenciaDto } from './dto/update-frecuencia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CooperativasService } from '../cooperativas/cooperativas.service';

@ApiTags('frecuencias')
@Controller('frecuencias')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FrecuenciasController {
  constructor(
    private readonly frecuenciasService: FrecuenciasService,
    private readonly cooperativasService: CooperativasService,
  ) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  create(@Body() createFrecuenciaDto: CreateFrecuenciaDto) {
    return this.frecuenciasService.create(createFrecuenciaDto);
  }

  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  async findAll(@Req() req: Request, @Query('cooperativaId') cooperativaId?: number) {
    return this.frecuenciasService.findAll(cooperativaId);
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  findOne(@Param('id') id: string) {
    return this.frecuenciasService.findOne(+id);
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  update(
    @Param('id') id: string,
    @Body() updateFrecuenciaDto: UpdateFrecuenciaDto,
  ) {
    return this.frecuenciasService.update(+id, updateFrecuenciaDto);
  }

  @Delete(':id')
  @Role(RolUsuario.ADMIN)
  remove(@Param('id') id: string) {
    return this.frecuenciasService.remove(+id);
  }
}
