import { Controller, Get, Patch, Param, Delete, UseGuards, Request, Body } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolUsuario } from '../auth/roles.enum';
import { ClienteEntity } from './entities/cliente.entity';

@Controller('clientes')
@ApiTags('clientes')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA) 
  @ApiOperation({ summary: 'Obtiene todos los clientes' })
  @ApiOkResponse({ type: ClienteEntity, isArray: true })
  findAll() {
    return this.clientesService.findAll();
  }

  @Get('me')
  @Role(RolUsuario.CLIENTE)
  @ApiOperation({ summary: 'Obtiene el perfil del cliente actual' })
  @ApiOkResponse({ type: ClienteEntity })
  findMe(@Request() req) {
    return this.clientesService.findByUsuarioId(req.user.sub);
  }

  @Patch('me')
  @Role(RolUsuario.CLIENTE)
  @ApiOperation({ summary: 'Actualiza el perfil del cliente actual' })
  @ApiOkResponse({ type: ClienteEntity })
  updateMe(@Request() req, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.updateProfile(req.user.sub, updateClienteDto);
  }

  @Delete('me')
  @Role(RolUsuario.CLIENTE)
  @ApiOperation({ summary: 'Elimina la cuenta del cliente actual' })
  @ApiOkResponse({ type: ClienteEntity })
  deleteMe(@Request() req) {
    return this.clientesService.deleteAccount(req.user.sub);
  }
}