import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { HojaTrabajoService } from './hoja-trabajo/hoja-trabajo.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('index')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly hojaTrabajoService: HojaTrabajoService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Endpoint principal de la aplicación' })
  @ApiResponse({ status: 200, description: 'Mensaje de bienvenida' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('buses-programados')
  @ApiOperation({ 
    summary: 'Obtener buses programados',
    description: 'Retorna la lista de buses programados con información detallada de viajes'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de buses programados obtenida exitosamente',
    schema: {
      example: {
        message: "Lista detallada de hojas de trabajo obtenida exitosamente",
        data: [
          {
            id: 11,
            placa: "DDDDD",
            imagen: "",
            piso_doble: true,
            total_asientos: 30,
            total_asientos_piso2: 20,
            horaSalidaProg: "12:00:00",
            horaLlegadaProg: "18:00:00",
            codigo: "AMBA-ELCO",
            ciudad_origen: "Ambato",
            ciudad_destino: "Puerto El Coca",
            nombre_cooperativa: "Cooperativa El Dorado",
            logo: "https://...",
            estado: "programado",
            idBus: 40,
            idCooperativa: 8,
            rutaId: 7,
            idFrecuencia: 8
          }
        ],
        count: 1
      }
    }
  })
  async getBusesProgramados() {
    return await this.hojaTrabajoService.getAll('programado');
  }
}
