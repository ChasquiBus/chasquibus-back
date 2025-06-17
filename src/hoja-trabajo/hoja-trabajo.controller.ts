import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HojaTrabajoService } from './hoja-trabajo.service';
import { CreateHojaTrabajoDto } from './dto/create-hoja-trabajo.dto';
import { UpdateHojaTrabajoDto } from './dto/update-hoja-trabajo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('hoja-trabajo')
@ApiBearerAuth('access-token')
@Controller('hoja-trabajo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HojaTrabajoController {
  constructor(private readonly hojaTrabajoService: HojaTrabajoService) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  create(@Body() createHojaTrabajoDto: CreateHojaTrabajoDto) {
    return this.hojaTrabajoService.create(createHojaTrabajoDto);
  }

  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  findAll() {
    return this.hojaTrabajoService.findAll();
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  findOne(@Param('id') id: string) {
    return this.hojaTrabajoService.findOne(+id);
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  update(@Param('id') id: string, @Body() updateHojaTrabajoDto: UpdateHojaTrabajoDto) {
    return this.hojaTrabajoService.update(+id, updateHojaTrabajoDto);
  }

  @Delete(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  remove(@Param('id') id: string) {
    return this.hojaTrabajoService.remove(+id);
  }
} 