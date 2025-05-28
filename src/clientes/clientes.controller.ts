import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolUsuario } from '../auth/roles.enum'; // Asegúrate de que la ruta sea correcta
import { ClienteEntity } from './entities/cliente.entity'; // Asegúrate de que la ruta sea correcta

@Controller('clientes')
@ApiTags('clientes')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA, RolUsuario.CLIENTE) // Define qué roles pueden acceder a estas rutas
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo cliente' })
  @ApiOkResponse({ type: ClienteEntity }) // Se asume que CreateClienteDto o el retorno de create() mapea a ClienteEntity
  @Role(RolUsuario.SUPERADMIN) // Opcional: Define un rol específico para la creación si es diferente
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene todos los clientes' })
  @ApiOkResponse({ type: ClienteEntity, isArray: true })
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un cliente por ID' })
  @ApiOkResponse({ type: ClienteEntity })
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id); // Usamos +id para convertir el string a número
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un cliente existente' })
  @ApiOkResponse({ type: ClienteEntity })
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto);
  }

  /**
   * Desactiva (elimina lógicamente) un cliente por su ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Desactiva un cliente' })
  @ApiOkResponse({ type: ClienteEntity }) // Debería devolver el usuario actualizado/desactivado
  @Role(RolUsuario.SUPERADMIN) // Opcional: Define un rol específico para la desactivación si es diferente
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }
}