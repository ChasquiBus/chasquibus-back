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
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { CooperativasService } from './cooperativas.service';
import { CreateCooperativaDto } from './dto/create-cooperativa.dto';
import { UpdateCooperativaDto } from './dto/update-cooperativa.dto';
import { Role } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolUsuario } from '../auth/roles.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cooperativas')
@ApiTags('cooperativas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CooperativasController {
  constructor(private readonly cooperativasService: CooperativasService) {}

  @Post()
  @Role(RolUsuario.SUPERADMIN)
  @UseInterceptors(FileInterceptor('logo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
        },
        nombre: {
          type: 'string',
          maxLength: 100,
          description: 'Nombre de la cooperativa'
        },
        ruc: {
          type: 'string',
          maxLength: 20,
          description: 'RUC de la cooperativa (10 a 13 dígitos)',
          example: '1790012345001'
        },
        colorPrimario: {
          type: 'string',
          maxLength: 20,
          description: 'Color primario en formato hexadecimal',
          example: '#123456'
        },
        colorSecundario: {
          type: 'string',
          maxLength: 20,
          description: 'Color secundario en formato hexadecimal',
          example: '#abcdef'
        },
        sitioWeb: {
          type: 'string',
          maxLength: 255,
          description: 'Sitio web oficial de la cooperativa',
          example: 'https://www.cooperativa.com'
        },
        email: {
          type: 'string',
          maxLength: 100,
          description: 'Correo electrónico de contacto',
          example: 'info@cooperativa.com'
        },
        telefono: {
          type: 'string',
          maxLength: 20,
          description: 'Número de teléfono de la cooperativa',
          example: '+593987654321'
        },
        direccion: {
          type: 'string',
          maxLength: 255,
          description: 'Dirección física de la cooperativa',
          example: 'Av. Amazonas y Naciones Unidas, Quito'
        }
      },
    },
  })
  create(
    @Body() createCooperativaDto: CreateCooperativaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.cooperativasService.create(createCooperativaDto, file);
  }

  @Get()
  @Role(RolUsuario.SUPERADMIN)
  findAll() {
    return this.cooperativasService.findAll(true);
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  findOne(@Param('id') id: number) {
    return this.cooperativasService.findOne(id);
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.SUPERADMIN)
  @UseInterceptors(FileInterceptor('logo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
          description: 'Logo de la cooperativa (archivo de imagen)',
          nullable: true
        },
        nombre: {
          type: 'string',
          maxLength: 100,
          description: 'Nombre de la cooperativa',
          example: 'Cooperativa de Transportes Unidos',
          nullable: true
        },
        ruc: {
          type: 'string',
          maxLength: 20,
          description: 'RUC de la cooperativa (10 a 13 dígitos)',
          example: '1790012345001',
          nullable: true
        },
        colorPrimario: {
          type: 'string',
          maxLength: 20,
          description: 'Color primario en formato hexadecimal',
          example: '#123456',
          nullable: true
        },
        colorSecundario: {
          type: 'string',
          maxLength: 20,
          description: 'Color secundario en formato hexadecimal',
          example: '#abcdef',
          nullable: true
        },
        sitioWeb: {
          type: 'string',
          maxLength: 255,
          description: 'Sitio web oficial de la cooperativa',
          example: 'https://www.cooperativa.com',
          nullable: true
        },
        email: {
          type: 'string',
          maxLength: 100,
          description: 'Correo electrónico de contacto',
          example: 'info@cooperativa.com',
          nullable: true
        },
        telefono: {
          type: 'string',
          maxLength: 20,
          description: 'Número de teléfono de la cooperativa',
          example: '+593987654321',
          nullable: true
        },
        direccion: {
          type: 'string',
          maxLength: 255,
          description: 'Dirección física de la cooperativa',
          example: 'Av. Amazonas y Naciones Unidas, Quito',
          nullable: true
        }
      },
    },
  })
  
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCooperativaDto: UpdateCooperativaDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {

    const adminId = req.user.rol === RolUsuario.ADMIN ? req.user.sub : undefined;
    return this.cooperativasService.update(id, updateCooperativaDto, adminId, file);
  }

  @Delete(':id')
  @Role(RolUsuario.SUPERADMIN)
  remove(@Param('id') id: number) {
    return this.cooperativasService.remove(id);
  }
}
