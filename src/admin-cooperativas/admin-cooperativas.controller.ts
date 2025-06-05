import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminCooperativasService } from './admin-cooperativas.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Role } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolUsuario } from '../auth/roles.enum';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UsuarioCooperativaEntity } from './entities/admin-cooperativa.entity';

@Controller('admin-cooperativas')
@ApiTags('admin-cooperativas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard )
@Role(RolUsuario.SUPERADMIN)
export class AdminCooperativasController {
  constructor(private readonly service: AdminCooperativasService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo administrador de cooperativa' })
  create(@Body() dto: CreateAdminDto) {
    return this.service.create(dto);
  }

 @Get()
  @ApiOperation({ summary: 'Obtiene todos los administradores de cooperativa' })
  @ApiOkResponse({ type: UsuarioCooperativaEntity, isArray: true })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un administrador de cooperativa por ID' })
  @ApiOkResponse({ type: UsuarioCooperativaEntity, isArray: true })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un administrador de cooperativa existente' })
  update(@Param('id') id: number, @Body() dto: UpdateAdminDto) {
    return this.service.update(id, dto);
  }

  /**
   * Desactiva (elimina lógicamente) un administrador de cooperativa por su ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Desactiva un administrador de cooperativa' })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
