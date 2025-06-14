import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CooperativasService } from './cooperativas.service';
import { CreateCooperativaDto } from './dto/create-cooperativa.dto';
import { UpdateCooperativaDto } from './dto/update-cooperativa.dto';
import { Role } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolUsuario } from '../auth/roles.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('cooperativas')
@ApiTags('cooperativas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard )
export class CooperativasController {
  constructor(private readonly service: CooperativasService) {}

  @Post()
  @Role( RolUsuario.SUPERADMIN)
  create(@Body() dto: CreateCooperativaDto) {
    return this.service.create(dto);
  }

  @Get()
  @Role(RolUsuario.SUPERADMIN)
  findAll() {
    return this.service.findAll(true);
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  update(
    @Param('id') id: number, 
    @Body() dto: UpdateCooperativaDto,
    @Request() req
  ) {
    // Si es admin, pasamos su ID para verificar permisos
    const adminId = req.user.rol === RolUsuario.ADMIN ? req.user.sub : undefined;
    return this.service.update(id, dto, adminId);
  }

  @Delete(':id')
  @Role( RolUsuario.SUPERADMIN)
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
