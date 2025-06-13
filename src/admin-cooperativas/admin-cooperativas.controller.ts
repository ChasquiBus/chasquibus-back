import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, Request, Query } from '@nestjs/common';
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
export class AdminCooperativasController {
  private readonly rolAdmin = RolUsuario.ADMIN;
  private readonly rolOfinista = RolUsuario.OFICINISTA;

  constructor(private readonly service: AdminCooperativasService) {}

  @Post("crear-admin-coop")
  @Role(RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Crea un nuevo administrador de cooperativa' })
  createAdmins(@Body() dto: CreateAdminDto) {
    return this.service.create(dto, this.rolAdmin);
  }

  @Post("crear-oficinista-coop")
  @Role(RolUsuario.SUPERADMIN,RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Crea un nuevo Oficinista de cooperativa' })
  createOficinistas(@Body() dto: CreateAdminDto) {
    return this.service.create(dto, this.rolOfinista);
  }

 @Get("obtener-admins")
 @Role(RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Obtiene todos los administrador de cooperativa' })
  @ApiOkResponse({ type: UsuarioCooperativaEntity, isArray: true })
  findAllAdmins() {
    return this.service.findAll(this.rolAdmin, 0, true);
  }

  @Get("obtener-oficinistas/:cooperativaId")
  @Role(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Obtiene todos los Oficinista de una cooperativa específica' })
  @ApiOkResponse({ type: UsuarioCooperativaEntity, isArray: true })
  findAllOficinistas(
    @Param('cooperativaId', ParseIntPipe) cooperativaId: number,
    @Query('includeDeleted') includeDeleted?: string
  ) {
    const includeDeletedBool = includeDeleted === 'true';
    return this.service.findAll(this.rolOfinista, cooperativaId, includeDeletedBool);
  }

  @Get(':id')
  @Role(RolUsuario.SUPERADMIN, RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtiene un administrador u  Oficinista de cooperativa por ID' })
  @ApiOkResponse({ type: UsuarioCooperativaEntity, isArray: true })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }
  @Patch(':id')
  @Role(RolUsuario.SUPERADMIN, RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Actualiza un administrador u  Oficinista de cooperativa existente' })
  update(@Param('id') id: number, @Body() dto: UpdateAdminDto) {
    return this.service.update(id, dto);
  }

  /**
   * Desactiva (elimina lógicamente) un administrador de cooperativa por su ID.
   */
  @Delete(':id')
   @Role(RolUsuario.SUPERADMIN)
  @ApiOperation({ summary: 'Desactiva un administrador de cooperativa' })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }

  @Delete('oficinista/:id')
  @Role(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Desactiva un oficinista de la cooperativa' })
  removeOficinista(@Param('id') id: number) {
    return this.service.removeOficinista(id);
  }
}
