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
import { ConfiguracionAsientosService } from './configuracion-asientos.service';
import { CreateConfiguracionAsientosDto } from './dto/create-configuracion-asientos.dto';
import { UpdateConfiguracionAsientosDto } from './dto/update-configuracion-asientos.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Role } from 'auth/decorators/roles.decorator';
import { RolUsuario } from 'auth/roles.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';

@Controller('configuracion-asientos')
@ApiTags('configuracion-asientos')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
export class ConfiguracionAsientosController {
  constructor(private readonly service: ConfiguracionAsientosService) {}

  @Post()
  @Role(RolUsuario.ADMIN, RolUsuario.OFICINISTA)
  @ApiOperation({ 
    summary: 'Crear configuración de asientos',
    description: `Crea una nueva configuración de asientos para un bus. 
    Reglas importantes:
    1. En el primer piso solo se permiten asientos NORMAL
    2. En el segundo piso pueden ser VIP o NORMAL
    3. Los precios de asientos VIP deben ser mayores que los asientos NORMAL
    4. Las filas y columnas deben ser números positivos
    5. Los precios deben tener máximo 2 decimales`
  })
  @ApiResponse({
    status: 201,
    description: 'Configuración de asientos creada exitosamente',
    schema: {
      example: {
        id: 1,
        busId: 1,
        posicionesJson: JSON.stringify([
          { 
            fila: 1, 
            columna: 1, 
            piso: 1, 
            tipoAsiento: 'NORMAL',
            precio: '25.50'
          },
          { 
            fila: 1, 
            columna: 1, 
            piso: 2, 
            tipoAsiento: 'VIP',
            precio: '35.50'
          }
        ])
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la validación de datos',
    schema: {
      example: {
        statusCode: 400,
        message: 'Los asientos del primer piso solo pueden ser de tipo NORMAL',
        error: 'Bad Request'
      }
    }
  })
  create(@Body() dto: CreateConfiguracionAsientosDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todas las configuraciones de asientos',
    description: 'Retorna la lista de todas las configuraciones de asientos en el sistema'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de configuraciones de asientos',
    schema: {
      example: [{
        id: 1,
        busId: 1,
        posicionesJson: JSON.stringify([
          { 
            fila: 1, 
            columna: 1, 
            piso: 1, 
            tipoAsiento: 'NORMAL',
            precio: '25.50'
          },
          { 
            fila: 1, 
            columna: 1, 
            piso: 2, 
            tipoAsiento: 'VIP',
            precio: '35.50'
          }
        ])
      }]
    }
  })
  findAll() {
    return this.service.findAll();
  }

  @Get('bus/:busId')
  @ApiOperation({ 
    summary: 'Obtener configuración de asientos por ID de bus',
    description: 'Retorna la configuración de asientos de un bus específico'
  })
  @ApiParam({
    name: 'busId',
    description: 'ID del bus para obtener su configuración de asientos',
    example: 1,
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Configuración de asientos del bus encontrada',
    schema: {
      example: {
        id: 1,
        busId: 1,
        posicionesJson: JSON.stringify([
          { 
            fila: 1, 
            columna: 1, 
            piso: 1, 
            tipoAsiento: 'NORMAL',
            precio: '25.50'
          },
          { 
            fila: 1, 
            columna: 1, 
            piso: 2, 
            tipoAsiento: 'VIP',
            precio: '35.50'
          }
        ])
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Bus no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'El bus no existe',
        error: 'Not Found'
      }
    }
  })
  findByBusId(@Param('busId') busId: string) {
    return this.service.findByBusId(+busId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener una configuración de asientos por ID',
    description: 'Retorna una configuración de asientos específica por su ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la configuración de asientos a consultar',
    example: 1,
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Configuración de asientos encontrada',
    schema: {
      example: {
        id: 1,
        busId: 1,
        posicionesJson: JSON.stringify([
          { 
            fila: 1, 
            columna: 1, 
            piso: 1, 
            tipoAsiento: 'NORMAL',
            precio: '25.50'
          },
          { 
            fila: 1, 
            columna: 1, 
            piso: 2, 
            tipoAsiento: 'VIP',
            precio: '35.50'
          }
        ])
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Configuración de asientos no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Configuración de asientos no encontrada',
        error: 'Not Found'
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar una configuración de asientos',
    description: `Actualiza una configuración de asientos existente.
    Reglas importantes:
    1. En el primer piso solo se permiten asientos NORMAL
    2. En el segundo piso pueden ser VIP o NORMAL
    3. Los precios de asientos VIP deben ser mayores que los asientos NORMAL
    4. Las filas y columnas deben ser números positivos
    5. Los precios deben tener máximo 2 decimales`
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la configuración de asientos a actualizar',
    example: 1,
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Configuración de asientos actualizada exitosamente',
    schema: {
      example: {
        id: 1,
        busId: 1,
        posicionesJson: JSON.stringify([
          { 
            fila: 1, 
            columna: 1, 
            piso: 1, 
            tipoAsiento: 'NORMAL',
            precio: '25.50'
          },
          { 
            fila: 1, 
            columna: 1, 
            piso: 2, 
            tipoAsiento: 'VIP',
            precio: '35.50'
          }
        ])
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Configuración de asientos no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Configuración de asientos no encontrada',
        error: 'Not Found'
      }
    }
  })
  update(@Param('id') id: string, @Body() dto: UpdateConfiguracionAsientosDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar una configuración de asientos',
    description: 'Elimina una configuración de asientos existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la configuración de asientos a eliminar',
    example: 1,
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Configuración de asientos eliminada exitosamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Configuración de asientos no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Configuración de asientos no encontrada',
        error: 'Not Found'
      }
    }
  })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
