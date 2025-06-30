import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { Database } from '../drizzle/database';
import { clientes } from '../drizzle/schema/clientes';
import { usuarioCooperativa } from '../drizzle/schema/usuario-cooperativa';
import { ventas } from '../drizzle/schema/ventas';
import { eq } from 'drizzle-orm';
import { CreateVentaDto, CreateVentaPresencialDto } from './dto/create-venta.dto';
import { CreateBoletoDto } from '../boletos/dto/create-boleto.dto';
import { EstadoPago, TipoVenta } from './dto/ventas.enum';
import { BoletosService } from '../boletos/boletos.service';
import { ConfiguracionAsientosService } from '../configuracion-asientos/configuracion-asientos.service';
import { PagosService } from '../pagos/pagos.service';

@Injectable()
export class CrearVentaService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly boletosService: BoletosService,
    private readonly asientosService: ConfiguracionAsientosService,
    private readonly pagosService: PagosService,
  ) {}
  /**
   * Método adicional para obtener información completa de la venta con pago
   */
  async createVentaConPago(createVentaDto: CreateVentaDto, usuarioId: number) {
    // Validar cliente
    const [cliente] = await this.db
      .select()
      .from(clientes)
      .where(eq(clientes.usuarioId, usuarioId))
      .limit(1);

    if (!cliente) throw new NotFoundException('No se encontró un cliente asociado');

    // Separar datos
    const { boletos: boletosData, ...ventaData } = createVentaDto;

    // Calcular totales usando función robusta para manejar decimales
    const toNumber = (value: string) => {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    };
    
    const totalSinDescuento = boletosData.reduce(
      (sum, b) => sum + toNumber(b.totalSinDescPorPers),
      0
    );
    
    const totalDescuentos = boletosData.reduce(
      (sum, b) => sum + toNumber(b.totalDescPorPers),
      0
    );
    
    const totalFinal = boletosData.reduce(
      (sum, b) => sum + toNumber(b.totalPorPer),
      0
    );

    // Actualizar asientos
    await this.asientosService.updateByBusId(createVentaDto.busId, {
      posiciones: createVentaDto.posiciones,
    });

    // Insertar venta
    const [nuevaVenta] = await this.db.insert(ventas).values({
      cooperativaId: ventaData.cooperativaId,
      clienteId: cliente.id,
      oficinistaId: null,
      metodoPagoId: ventaData.metodoPagoId,
      estadoPago: EstadoPago.PENDIENTE,
      tipoVenta: TipoVenta.ONLINE,
      totalSinDescuento: totalSinDescuento.toString(),
      totalDescuentos: totalDescuentos.toString(),
      totalFinal: totalFinal.toString(),
      fechaVenta: new Date(),
    }).returning();

    // Delegar creación de boletos
    const boletosToInsert: CreateBoletoDto[] = boletosData.map(boleto => ({
      ...boleto,
      ventaId: nuevaVenta.id,
      codigoQr: 'null',
    }));

    await this.boletosService.crearBoletos(boletosToInsert);

    // Procesar pago después de crear la venta
    let resultadoPago;
    try {
      resultadoPago = await this.pagosService.procesarPago(nuevaVenta.id, ventaData.metodoPagoId);
    } catch (error) {
      // Si falla el procesamiento del pago, no afectamos la creación de la venta
      console.error('Error al procesar pago:', error);
      resultadoPago = { error: 'Error al procesar pago', mensaje: error.message };
    }

    return {
      venta: nuevaVenta,
      boletos: boletosToInsert,
      pago: resultadoPago
    };
  }

  async crearVentaPresencial(createVentaPresencialDto: CreateVentaPresencialDto, usuarioId: number) {
    // 1. Obtener oficinistaId y cooperativaId desde usuario_cooperativa
    const [oficinista] = await this.db
      .select()
      .from(usuarioCooperativa)
      .where(eq(usuarioCooperativa.usuarioId, usuarioId))
      .limit(1);

    if (!oficinista) throw new NotFoundException('No se encontró un oficinista asociado a este usuario');

    // 2. Separar datos
    const { boletos: boletosData, ...ventaData } = createVentaPresencialDto;

    // 3. Calcular totales
    const toNumber = (value: string) => {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    };
    
    const totalSinDescuento = boletosData.reduce(
      (sum, b) => sum + toNumber(b.totalSinDescPorPers),
      0
    );
    
    const totalDescuentos = boletosData.reduce(
      (sum, b) => sum + toNumber(b.totalDescPorPers),
      0
    );
    
    const totalFinal = boletosData.reduce(
      (sum, b) => sum + toNumber(b.totalPorPer),
      0
    );

    // 4. Actualizar asientos
    await this.asientosService.updateByBusId(createVentaPresencialDto.busId, {
      posiciones: createVentaPresencialDto.posiciones,
    });

    // 5. Insertar venta
    const [nuevaVenta] = await this.db.insert(ventas).values({
      cooperativaId: oficinista.cooperativaTransporteId,
      clienteId: null,
      oficinistaId: oficinista.id,
      metodoPagoId: null,
      hojaTrabajoId: ventaData.hojaTrabajoId,
      estadoPago: EstadoPago.APROBADO, // pagado
      comprobanteUrl: null,
      fechaVenta: new Date(),
      tipoVenta: TipoVenta.PRESENCIAL,
      totalSinDescuento: totalSinDescuento.toString(),
      totalDescuentos: totalDescuentos.toString(),
      totalFinal: totalFinal.toString(),
    }).returning();

    // 6. Crear boletos
    const boletosToInsert: CreateBoletoDto[] = boletosData.map(boleto => ({
      ...boleto,
      ventaId: nuevaVenta.id,
      codigoQr: 'null',
    }));

    await this.boletosService.crearBoletos(boletosToInsert);

    // 7. Retornar venta y boletos
    return {
      venta: nuevaVenta,
      boletos: boletosToInsert,
    };
  }
}