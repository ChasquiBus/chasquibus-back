import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { BoletosService } from './boletos.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { Boleto } from './entities/boleto.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { RolUsuario } from '../auth/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Tesseract from 'tesseract.js';

@ApiTags('boletos')
@Controller('boletos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}


  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener todos los boletos de la cooperativa' })
  @ApiResponse({ status: 200, description: 'Lista de boletos de la cooperativa', type: [Boleto] })
  findAll(@CurrentUser() user: JwtPayload): Promise<Boleto[]> {
    if (!user.cooperativaId) {
      throw new BadRequestException('Cooperativa ID no encontrada en el token');
    }
    return this.boletosService.findByCooperativa(user.cooperativaId);
  }

  @Get('mis-boletos')
  @Role(RolUsuario.CLIENTE)
  @ApiOperation({ summary: 'Obtener boletos del cliente autenticado los pagados' })
  @ApiResponse({ status: 200, description: 'Lista de boletos del cliente', type: [Boleto] })
  findMyBoletos(@CurrentUser() user: JwtPayload): Promise<Boleto[]> {
    return this.boletosService.findByCliente(user.sub);
  }

  @Get('chofer')
  @Role(RolUsuario.CHOFER)
  @ApiOperation({ summary: 'Obtener boletos del chofer autenticado solo los pagados' })
  @ApiQuery({ name: 'hojaTrabajoId', required: false, description: 'ID de la hoja de trabajo' })
  @ApiResponse({ status: 200, description: 'Lista de boletos del chofer', type: [Boleto] })
  findChoferBoletos(
    @CurrentUser() user: JwtPayload,
    @Query('hojaTrabajoId') hojaTrabajoId?: string,
  ): Promise<Boleto[]> {
    const hojaTrabajoIdNumber = hojaTrabajoId ? parseInt(hojaTrabajoId) : undefined;
    return this.boletosService.findByChofer(user.sub, hojaTrabajoIdNumber);
  }

  @Get(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener un boleto por ID' })
  @ApiParam({ name: 'id', description: 'ID del boleto' })
  @ApiResponse({ status: 200, description: 'Boleto encontrado', type: Boleto })
  @ApiResponse({ status: 404, description: 'Boleto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Boleto> {
    return this.boletosService.findOne(id);
  }

  @Patch(':id')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Actualizar un boleto' })
  @ApiParam({ name: 'id', description: 'ID del boleto' })
  @ApiResponse({ status: 200, description: 'Boleto actualizado exitosamente', type: Boleto })
  @ApiResponse({ status: 404, description: 'Boleto no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBoletoDto: UpdateBoletoDto,
  ): Promise<Boleto> {
    return this.boletosService.update(id, updateBoletoDto);
  }

  @Get('venta/:ventaId')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener boletos por ID de venta' })
  @ApiParam({ name: 'ventaId', description: 'ID de la venta' })
  @ApiResponse({ status: 200, description: 'Boletos de la venta', type: [Boleto] })
  findByVentaId(@Param('ventaId', ParseIntPipe) ventaId: number): Promise<Boleto[]> {
    return this.boletosService.findByVentaId(ventaId);
  }

  @Get('cedula/:cedula')
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener boletos por cédula del pasajero' })
  @ApiParam({ name: 'cedula', description: 'Cédula del pasajero' })
  @ApiResponse({ status: 200, description: 'Boletos del pasajero', type: [Boleto] })
  findByCedula(@Param('cedula') cedula: string): Promise<Boleto[]> {
    return this.boletosService.findByCedula(cedula);
  }

  @Post('cedula-ocr')
  @Role(RolUsuario.CLIENTE)
  @UseInterceptors(FileInterceptor('file'))
  async ocrCedula(@UploadedFile() file: Express.Multer.File) {
    // Procesar la imagen con Tesseract
    const { data } = await Tesseract.recognize(file.buffer, 'spa'); // 'spa' para español
    const texto = data.text;

    // Buscar cédula (10 dígitos)
    const cedulaMatch = texto.match(/\d{10}/);
    const cedula = cedulaMatch ? cedulaMatch[0] : null;

    // Buscar nombre (ajusta según el formato de la cédula)
    // Ejemplo: busca la palabra NOMBRES o NOMBRE y toma la línea siguiente
    let nombre: string | null = null;
    const nombreRegex = /NOMBRES?\s*[:\-]?\s*([A-ZÁÉÍÓÚÑ ]+)/i;
    const nombreMatch = texto.match(nombreRegex);
    if (nombreMatch) {
      nombre = nombreMatch[1].trim();
    } else {
      // Alternativa: tomar la primera línea en mayúsculas que no sea la cédula
      const lineas = texto.split('\n').map(l => l.trim()).filter(Boolean);
      for (const linea of lineas) {
        if (/^[A-ZÁÉÍÓÚÑ ]{5,}$/.test(linea) && !/\d{10}/.test(linea)) {
          nombre = linea;
          break;
        }
      }
    }

    return { nombre, cedula, textoCompleto: texto };
  }
} 