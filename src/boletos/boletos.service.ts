import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { Database } from '../drizzle/database';
import { boletos } from '../drizzle/schema/boletos';
import { ventas} from '../drizzle/schema/ventas';
import { clientes} from '../drizzle/schema/clientes';
import { choferes} from '../drizzle/schema/choferes';
import { hojaTrabajo} from '../drizzle/schema/hoja-trabajo';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { Boleto } from './entities/boleto.entity';
import { eq, and } from 'drizzle-orm';
import { EstadoPago } from 'ventas/dto/ventas.enum';

@Injectable()
export class BoletosService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async crearBoletos(createBoletoDto: CreateBoletoDto[]): Promise<Boleto[]> {
    const nuevosboletos = await this.db
      .insert(boletos)
      .values(createBoletoDto)
      .returning();

    return nuevosboletos;
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
  async findByCooperativa(cooperativaId: number): Promise<Boleto[]> {
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
      })
      .from(boletos)
      .innerJoin(ventas, eq(boletos.ventaId, ventas.id))
      .where(eq(ventas.cooperativaId, cooperativaId));
  }

  // Para clientes - obtener boletos del cliente con ventas pagadas
  async findByCliente(usuarioId: number): Promise<Boleto[]> {
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
      })
      .from(boletos)
      .innerJoin(ventas, eq(boletos.ventaId, ventas.id))
      .innerJoin(clientes, eq(ventas.clienteId, clientes.id))
      .where(
        and(
          eq(clientes.usuarioId, usuarioId),
          eq(ventas.estadoPago, EstadoPago.APROBADO)
        )
      );
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
      })
      .from(boletos)
      .innerJoin(ventas, eq(boletos.ventaId, ventas.id))
      .innerJoin(hojaTrabajo, eq(ventas.hojaTrabajoId, hojaTrabajo.id))
      .innerJoin(choferes, eq(hojaTrabajo.choferId, choferes.id))
      .where(and(...conditions));
  }
} 