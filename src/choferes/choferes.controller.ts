import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChoferesService } from './choferes.service';
import { CreateChoferDto } from './dto/create-chofer.dto';
import { UpdateChoferDto } from './dto/update-chofer.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolUsuario } from '../auth/roles.enum';
import { Chofer } from './entities/chofer.entity';

@Controller('choferes')
@ApiTags('choferes')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChoferesController {
  constructor(private readonly choferesService: ChoferesService) {}

  @Post()
  @Role(RolUsuario.OFICINISTA, RolUsuario.ADMIN) 
  @ApiOperation({ summary: 'Crea un nuevo chofer' })
  @ApiOkResponse({ type: Chofer })
  create(@Body() createChoferDto: CreateChoferDto) {
    return this.choferesService.create(createChoferDto);
  }

  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtiene todos los choferes' })
  @ApiOkResponse({ type: Chofer, isArray: true })
  findAll() {
    return this.choferesService.findAll();
  }

  @Get(':id')
  @Role(RolUsuario.CHOFER, RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtiene un chofer por ID' })
  @ApiOkResponse({ type: Chofer })
  findOne(@Param('id') id: string) {
    return this.choferesService.findOne(+id);
  }

  @Patch(':id')
  @Role(RolUsuario.CHOFER, RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Actualiza un chofer existente' })
  @ApiOkResponse({ type: Chofer })
  update(@Param('id') id: string, @Body() updateChoferDto: UpdateChoferDto) {
    return this.choferesService.update(+id, updateChoferDto);
  }

  @Delete(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Desactiva (elimina lógicamente) un chofer' })
  @ApiOkResponse({ type: Chofer })
  remove(@Param('id') id: string) {
    return this.choferesService.remove(+id);
  }
}
