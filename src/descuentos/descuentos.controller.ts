// descuentos.controller.ts
import {
  Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { DescuentosService } from './descuentos.service';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../auth/roles.enum';

@ApiTags('descuentos')
@Controller('descuentos')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DescuentosController {
  constructor(private readonly descuentosService: DescuentosService) {}

  @Post('/superadmin')
  @Role(RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Crear un nuevo descuento' })
  @ApiResponse({ status: 201, description: 'Descuento creado exitosamente' })
  create(@Body() createDescuentoDto: CreateDescuentoDto) {
    return this.descuentosService.create(createDescuentoDto);
  }

  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA, RolUsuario.CHOFER , RolUsuario.CLIENTE)
  @ApiOperation({ summary: 'Listar todos los descuentos' })
  @ApiResponse({ status: 200, description: 'Lista de descuentos' })
  findAll() {
    return this.descuentosService.findAll();
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA, RolUsuario.CHOFER , RolUsuario.CLIENTE)
  @ApiOperation({ summary: 'Obtener un descuento por ID' })
  @ApiResponse({ status: 200, description: 'Descuento encontrado' })
  @ApiResponse({ status: 404, description: 'Descuento no encontrado' })
  findOne(@Param('id') id: string) {
    const idNum = Number(id);
    if (isNaN(idNum)) {
    throw new BadRequestException('El ID debe ser un número válido');
    }
  return this.descuentosService.findOne(idNum);
  }

  @Put('superadmin/:id')
  @Role(RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Actualizar un descuento por ID' })
  @ApiResponse({ status: 200, description: 'Descuento actualizado' })
  @ApiResponse({ status: 404, description: 'Descuento no encontrado' })
  update(@Param('id') id: string, @Body() updateDescuentoDto: UpdateDescuentoDto) {
    return this.descuentosService.update(+id, updateDescuentoDto);
  }

  @Delete('superadmin/:id')
  @Role(RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Eliminar un descuento por ID' })
  @ApiResponse({ status: 200, description: 'Descuento eliminado' })
  @ApiResponse({ status: 404, description: 'Descuento no encontrado' })
  remove(@Param('id') id: string) {
    return this.descuentosService.remove(+id);
  }
}
