import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ChoferesService } from './choferes.service';
import { CreateChoferDto } from './dto/create-chofer.dto';
import { UpdateChoferDto } from './dto/update-chofer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolUsuario } from '../auth/roles.enum';
import { Chofer } from './entities/chofer.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('choferes')
@Controller('choferes')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChoferesController {
  constructor(private readonly choferesService: ChoferesService) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Crea un nuevo chofer' })
  @ApiResponse({ status: 201, description: 'Chofer creado exitosamente', type: Chofer })
  create(@Body() createChoferDto: CreateChoferDto, @Request() req) {
    return this.choferesService.create(createChoferDto, req.user);
  }

  @Get(':cooperativaId')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtiene todos los choferes de una cooperativa específica' })
  @ApiResponse({ status: 200, description: 'Lista de choferes', type: [Chofer] })
  findAll(
    @Param('cooperativaId', ParseIntPipe) cooperativaId: number,
    @Query('includeDeleted') includeDeleted?: string
  ) {
    const includeDeletedBool = includeDeleted === 'true';
    return this.choferesService.findAll(cooperativaId, includeDeletedBool);
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtiene un chofer por ID' })
  @ApiResponse({ status: 200, description: 'Chofer encontrado', type: Chofer })
  @ApiResponse({ status: 404, description: 'Chofer no encontrado' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.choferesService.findOne(+id, req.user);
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Actualiza un chofer existente' })
  @ApiResponse({ status: 200, description: 'Chofer actualizado exitosamente', type: Chofer })
  @ApiResponse({ status: 404, description: 'Chofer no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateChoferDto: UpdateChoferDto,
    @Request() req,
  ) {
    return this.choferesService.update(+id, updateChoferDto, req.user);
  }

  @Delete(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Desactiva (elimina lógicamente) un chofer' })
  @ApiResponse({ status: 200, description: 'Chofer desactivado exitosamente', type: Chofer })
  @ApiResponse({ status: 404, description: 'Chofer no encontrado' })
  remove(@Param('id') id: string, @Request() req) {
    return this.choferesService.remove(+id, req.user);
  }
}
