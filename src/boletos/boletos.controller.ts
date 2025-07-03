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
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { Boleto, BoletoDetalleResponseDto } from './entities/boleto.entity';
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
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}


  @Get()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ summary: 'Obtener todos los boletos de la cooperativa' })
  @ApiResponse({ status: 200, description: 'Lista de boletos de la cooperativa', type: [BoletoDetalleResponseDto] })
  @ApiQuery({ name: 'usado', required: false, type: Boolean, description: 'Filtrar por si el boleto fue usado o no' })
  findAll(@CurrentUser() user: JwtPayload, @Query('usado') usado?: string): Promise<BoletoDetalleResponseDto[]> {
    if (!user.cooperativaId) {
      throw new BadRequestException('Cooperativa ID no encontrada en el token');
    }
    let usadoBool: boolean | undefined = undefined;
    if (usado !== undefined) {
      usadoBool = usado === 'true';
    }
    return this.boletosService.findByCooperativa(user.cooperativaId, usadoBool);
  }

  @Get('mis-boletos')
  @Role(RolUsuario.CLIENTE)
  @ApiOperation({ summary: 'Obtener boletos del cliente autenticado los pagados' })
  @ApiResponse({ status: 200, description: 'Lista de boletos del cliente', type: [BoletoDetalleResponseDto] })
  @ApiQuery({ name: 'usado', required: false, type: Boolean, description: 'Filtrar por si el boleto fue usado o no' })
  findMyBoletos(@CurrentUser() user: JwtPayload, @Query('usado') usado?: string): Promise<BoletoDetalleResponseDto[]> {
    let usadoBool: boolean | undefined = undefined;
    if (usado !== undefined) {
      usadoBool = usado === 'true';
    }
    return this.boletosService.findByCliente(user.sub, usadoBool);
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

    // Buscar cédula en línea con 'N°', 'CEDULA' o 'CÉDULA'
    let cedula: string | null = null;
    const lineas = texto.split('\n').map(l => l.trim()).filter(Boolean);
    for (const linea of lineas) {
      if (/N°|Nº|C[ÉE]DULA/i.test(linea)) {
        const match = linea.match(/\d{10}/);
        if (match) {
          cedula = match[0];
          break;
        }
      }
    }
    // Si no se encontró en la línea de 'N°' o 'CEDULA', buscar en todo el texto
    if (!cedula) {
      const match = texto.match(/\d{10}/);
      if (match) {
        cedula = match[0];
      }
    }

    // Buscar apellidos y nombres
    let nombre: string | null = null;
    for (let i = 0; i < lineas.length; i++) {
      if (/APELLIDOS? Y? NOMBRES?/i.test(lineas[i])) {
        let apellidos = (lineas[i + 1] || '').replace(/[^A-ZÁÉÍÓÚÑ ]/gi, '').replace(/\s+/g, ' ').trim();
        let nombres = (lineas[i + 2] || '').replace(/[^A-ZÁÉÍÓÚÑ ]/gi, '').replace(/\s+/g, ' ').trim();
        // Ignorar líneas con palabras clave
        if (/LUGAR|NACIMIENTO|FECHA|NACIONALIDAD|SEXO|ESTADO/i.test(apellidos)) apellidos = '';
        if (/LUGAR|NACIMIENTO|FECHA|NACIONALIDAD|SEXO|ESTADO/i.test(nombres)) nombres = '';
        nombre = [apellidos, nombres].filter(Boolean).join(' ');
        break;
      }
    }
    // Fallbacks anteriores si no se encuentra el patrón
    if (!nombre || nombre.length < 5) {
      const palabrasClave = [
        'APELLIDOS', 'NOMBRES', 'APELLIDOS Y NOMBRES', 'CEDULA', 'IDENTIFICACION', 'CIUDADANIA', 'NACIONALIDAD', 'SEXO', 'LUGARDE NACIMIENTO'
      ];
      // 1. Buscar la línea más larga con 3-5 palabras en mayúsculas
      let maxLinea = '';
      for (const linea of lineas) {
        if (
          /^[A-ZÁÉÍÓÚÑ ]{10,}$/.test(linea) &&
          !/\d/.test(linea) &&
          !palabrasClave.some(clave => linea.includes(clave)) &&
          linea.split(' ').length >= 3 &&
          linea.split(' ').length <= 5 &&
          linea.length > maxLinea.length
        ) {
          maxLinea = linea;
        }
      }
      if (maxLinea.length > 5) {
        nombre = maxLinea;
      }
      // 2. Fallback: lógica anterior
      if (!nombre || nombre.length < 5) {
        const nombreRegex = /NOMBRES?\s*[:\-]?\s*([A-ZÁÉÍÓÚÑ ]+)/i;
        const nombreMatch = texto.match(nombreRegex);
        if (nombreMatch) {
          nombre = nombreMatch[1].trim();
        } else {
          for (const linea of lineas) {
            if (/^[A-ZÁÉÍÓÚÑ ]{5,}$/.test(linea) && !/\d{10}/.test(linea)) {
              nombre = linea;
              break;
            }
          }
        }
      }
    }

    return { nombre, cedula, textoCompleto: texto };
  }

  @Patch('abordar/:id')
@Role(RolUsuario.CHOFER)
@ApiOperation({ summary: 'Registrar abordaje del pasajero (marcar boleto como usado)' })
@ApiParam({ name: 'id', description: 'ID del boleto' })
@ApiResponse({ status: 200, description: 'Boleto actualizado como usado', type: Boleto })
@ApiResponse({ status: 404, description: 'Boleto no encontrado' })
@ApiResponse({ status: 400, description: 'El boleto ya fue usado' })
registrarAbordaje(@Param('id', ParseIntPipe) id: number): Promise<{ id: number; usado: boolean }>{
  return this.boletosService.registrarAbordaje(id);
}

} 