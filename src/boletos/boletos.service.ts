import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { Database } from '../drizzle/database';
import { boletos } from '../drizzle/schema/boletos';
import { ventas} from '../drizzle/schema/ventas';
import { clientes} from '../drizzle/schema/clientes';
import { choferes} from '../drizzle/schema/choferes';
import { hojaTrabajo} from '../drizzle/schema/hoja-trabajo';
import { cooperativaTransporte } from '../drizzle/schema/cooperativa-transporte';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { Boleto } from './entities/boleto.entity';
import { eq, and } from 'drizzle-orm';
import { EstadoPago } from 'ventas/dto/ventas.enum';
import { generarCodigoQRBoleto, determinarAplicoDescuento } from './utils/qr-generator.util';
import { tarifas } from '../drizzle/schema/tarifas';
import { buses } from '../drizzle/schema/bus';
import { frecuencias } from '../drizzle/schema/frecuencias';
import { rutas } from '../drizzle/schema/rutas';
import { BoletoDetalleResponseDto } from './entities/boleto.entity';

@Injectable()
export class BoletosService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  /**
   * Obtiene el nombre de la cooperativa por su ID
   */
  private async obtenerNombreCooperativa(cooperativaId: number): Promise<string> {
    const [cooperativa] = await this.db
      .select({ nombre: cooperativaTransporte.nombre })
      .from(cooperativaTransporte)
      .where(eq(cooperativaTransporte.id, cooperativaId))
      .limit(1);

    return cooperativa?.nombre || 'Cooperativa no encontrada';
  }

  async crearBoletos(createBoletoDto: CreateBoletoDto[]): Promise<Boleto[]> {
    // Insertar boletos primero para obtener los IDs
    const nuevosBoletos = await this.db
      .insert(boletos)
      .values(createBoletoDto)
      .returning();

    // Obtener la cooperativa de la primera venta para generar QRs
    const [primerBoleto] = nuevosBoletos;
    if (!primerBoleto) {
      throw new NotFoundException('No se pudo crear ningún boleto');
    }

    // Obtener información de la venta para acceder a la cooperativa
    const [venta] = await this.db
      .select({ cooperativaId: ventas.cooperativaId })
      .from(ventas)
      .where(eq(ventas.id, primerBoleto.ventaId!))
      .limit(1);

    if (!venta) {
      throw new NotFoundException('No se encontró la venta asociada');
    }

    const nombreCooperativa = await this.obtenerNombreCooperativa(venta.cooperativaId!);

    // Generar códigos QR y actualizar boletos
    const boletosActualizados = await Promise.all(
      nuevosBoletos.map(async (boleto) => {
        const aplicoDescuento = determinarAplicoDescuento(boleto.totalDescPorPers || '0');
        
        const codigoQR = await generarCodigoQRBoleto({
          idBoleto: boleto.id,
          nombre: boleto.nombre || '',
          apellido: boleto.apellido || '',
          cedula: boleto.cedula || '',
          usado: boleto.usado || false,
          cooperativa: nombreCooperativa,
          aplicoDescuento
        });

        // Actualizar el boleto con el código QR generado
        const [boletoActualizado] = await this.db
          .update(boletos)
          .set({ codigoQr: codigoQR })
          .where(eq(boletos.id, boleto.id))
          .returning();

        return boletoActualizado;
      })
    );

    return boletosActualizados;
  }

  async findAll(): Promise<Boleto[]> {
    return await this.db.select().from(boletos);
  }

  async findOne(id: number): Promise<Boleto> {
    const [boleto] = await this.db
      .select()
      .from(boletos)
      .where(eq(boletos.id, id));

    if (!boleto) {
      throw new NotFoundException(`Boleto con ID ${id} no encontrado`);
    }

    return boleto;
  }

  async update(id: number, updateBoletoDto: UpdateBoletoDto): Promise<Boleto> {
    const [updatedBoleto] = await this.db
      .update(boletos)
      .set(updateBoletoDto)
      .where(eq(boletos.id, id))
      .returning();

    if (!updatedBoleto) {
      throw new NotFoundException(`Boleto con ID ${id} no encontrado`);
    }

    return updatedBoleto;
  }

  async findByVentaId(ventaId: number): Promise<Boleto[]> {
    return await this.db
      .select()
      .from(boletos)
      .where(eq(boletos.ventaId, ventaId));
  }

  async findByCedula(cedula: string): Promise<Boleto[]> {
    return await this.db
      .select()
      .from(boletos)
      .where(eq(boletos.cedula, cedula));
  }

  // Para oficinistas/admins - obtener todos los boletos de la cooperativa
  async findByCooperativa(cooperativaId: number, usado?: boolean): Promise<BoletoDetalleResponseDto[]> {
    const whereConds = [eq(ventas.cooperativaId, cooperativaId)];
    if (usado !== undefined) {
      whereConds.push(eq(boletos.usado, usado));
    }
    const rows = await this.db
      .select({
        id: boletos.id,
        ventaId: boletos.ventaId,
        tarifaId: boletos.tarifaId,
        descuentoId: boletos.descuentoId,
        asientoNumero: boletos.asientoNumero,
        codigoQr: boletos.codigoQr,
        cedula: boletos.cedula,
        nombre: boletos.nombre,
        totalSinDescPorPers: boletos.totalSinDescPorPers,
        totalDescPorPers: boletos.totalDescPorPers,
        totalPorPer: boletos.totalPorPer,
        valorTarifa: tarifas.valor,
        tipoAsiento: tarifas.tipoAsiento,
        tipoVenta: ventas.tipoVenta,
        hojaTrabajoId: ventas.hojaTrabajoId,
        busId: hojaTrabajo.busId,
        estadoHojaTrabajo: hojaTrabajo.estado,
        fechaSalida: hojaTrabajo.fechaSalida,
        numeroBus: buses.numero_bus,
        placaBus: buses.placa,
      })
      .from(boletos)
      .innerJoin(ventas, eq(boletos.ventaId, ventas.id))
      .innerJoin(tarifas, eq(boletos.tarifaId, tarifas.id))
      .leftJoin(hojaTrabajo, eq(ventas.hojaTrabajoId, hojaTrabajo.id))
      .leftJoin(buses, eq(hojaTrabajo.busId, buses.id))
      .where(whereConds.length > 1 ? and(...whereConds) : whereConds[0]);
    return rows as BoletoDetalleResponseDto[];
  }

  // Para clientes - obtener boletos del cliente con ventas pagadas
  async findByCliente(usuarioId: number, usado?: boolean): Promise<BoletoDetalleResponseDto[]> {
    const whereConds = [
      eq(clientes.usuarioId, usuarioId),
      eq(ventas.estadoPago, EstadoPago.APROBADO)
    ];
    if (usado !== undefined) {
      whereConds.push(eq(boletos.usado, usado));
    }
    const rows = await this.db
      .select({
        id: boletos.id,
        ventaId: boletos.ventaId,
        tarifaId: boletos.tarifaId,
        descuentoId: boletos.descuentoId,
        asientoNumero: boletos.asientoNumero,
        codigoQr: boletos.codigoQr,
        cedula: boletos.cedula,
        nombre: boletos.nombre,
        totalSinDescPorPers: boletos.totalSinDescPorPers,
        totalDescPorPers: boletos.totalDescPorPers,
        totalPorPer: boletos.totalPorPer,
        valorTarifa: tarifas.valor,
        tipoAsiento: tarifas.tipoAsiento,
        tipoVenta: ventas.tipoVenta,
        hojaTrabajoId: ventas.hojaTrabajoId,
        cooperativaId: ventas.cooperativaId,
        nombreCooperativa: cooperativaTransporte.nombre,
        logoCooperativa: cooperativaTransporte.logo,
        telefonoCooperativa: cooperativaTransporte.telefono,
        busId: hojaTrabajo.busId,
        estadoHojaTrabajo: hojaTrabajo.estado,
        frecDiaId: hojaTrabajo.frecDiaId,
        fechaSalida: hojaTrabajo.fechaSalida,
        numeroBus: buses.numero_bus,
        placaBus: buses.placa,
        horaSalidaProg: frecuencias.horaSalidaProg,
        rutaId: frecuencias.rutaId,
        codigoRuta: rutas.codigo,
      })
      .from(boletos)
      .innerJoin(ventas, eq(boletos.ventaId, ventas.id))
      .innerJoin(clientes, eq(ventas.clienteId, clientes.id))
      .innerJoin(tarifas, eq(boletos.tarifaId, tarifas.id))
      .leftJoin(hojaTrabajo, eq(ventas.hojaTrabajoId, hojaTrabajo.id))
      .leftJoin(cooperativaTransporte, eq(ventas.cooperativaId, cooperativaTransporte.id))
      .leftJoin(buses, eq(hojaTrabajo.busId, buses.id))
      .leftJoin(frecuencias, eq(hojaTrabajo.frecDiaId, frecuencias.id))
      .leftJoin(rutas, eq(frecuencias.rutaId, rutas.id))
      .where(and(...whereConds));
    return rows as BoletoDetalleResponseDto[];
  }

  // Para choferes - obtener boletos por hoja de trabajo y ventas pagadas
  async findByChofer(usuarioId: number, hojaTrabajoId?: number): Promise<Boleto[]> {
    const conditions = [
      eq(choferes.usuarioId, usuarioId),
      eq(ventas.estadoPago,  EstadoPago.APROBADO)
    ];

    if (hojaTrabajoId) {
      conditions.push(eq(ventas.hojaTrabajoId, hojaTrabajoId));
    }

    return await this.db
      .select({
        id: boletos.id,
        ventaId: boletos.ventaId,
        tarifaId: boletos.tarifaId,
        descuentoId: boletos.descuentoId,
        asientoNumero: boletos.asientoNumero,
        codigoQr: boletos.codigoQr,
        cedula: boletos.cedula,
        nombre: boletos.nombre,
        totalSinDescPorPers: boletos.totalSinDescPorPers,
        totalDescPorPers: boletos.totalDescPorPers,
        totalPorPer: boletos.totalPorPer,
        usado: boletos.usado,
      })
      .from(boletos)
      .innerJoin(ventas, eq(boletos.ventaId, ventas.id))
      .innerJoin(hojaTrabajo, eq(ventas.hojaTrabajoId, hojaTrabajo.id))
      .innerJoin(choferes, eq(hojaTrabajo.choferId, choferes.id))
      .where(and(...conditions));
  }

  async registrarAbordaje(idBoleto: number): Promise<{ id: number; usado: boolean }> {
    const [boleto] = await this.db
      .select()
      .from(boletos)
      .where(eq(boletos.id, idBoleto));
  
    if (!boleto) {
      throw new NotFoundException(`Boleto con ID ${idBoleto} no encontrado`);
    }
  
    if (boleto.usado) {
      throw new BadRequestException('El boleto ya fue usado para abordar');
    }
  
    const [boletoActualizado] = await this.db
      .update(boletos)
      .set({ usado: true })
      .where(eq(boletos.id, idBoleto))
      .returning({ id: boletos.id, usado: boletos.usado });
  
    return boletoActualizado;
  }
  
} 