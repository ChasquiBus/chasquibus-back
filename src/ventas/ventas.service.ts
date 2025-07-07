import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { ventas } from '../drizzle/schema/ventas';
import { usuarioCooperativa } from '../drizzle/schema/usuario-cooperativa';
import { clientes } from '../drizzle/schema/clientes';
import { eq, and } from 'drizzle-orm';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Venta } from './entities/venta.entity';
import type { Database } from '../drizzle/database';
import { EstadoPago, TipoVenta } from './dto/ventas.enum';

@Injectable()
export class VentasService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async findOne(id: number): Promise<Venta> {
    const [venta] = await this.db
      .select()
      .from(ventas)
      .where(eq(ventas.id, id));

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return venta;
  }

  
  async findByCliente(clienteId: number): Promise<Venta[]> {
    return await this.db
      .select()
      .from(ventas)
      .where(eq(ventas.clienteId, clienteId));
  }

  async findByEstadoPago(estadoPago: string): Promise<Venta[]> {
    return await this.db
      .select()
      .from(ventas)
      .where(eq(ventas.estadoPago, estadoPago));
  }

  // Para admins - obtener todas las ventas de un oficinista
  async findByOficinista(oficinistaId: number): Promise<Venta[]> {
    return await this.db
      .select()
      .from(ventas)
      .where(eq(ventas.oficinistaId, oficinistaId));
  }

  // Para oficinistas/admins - obtener todas las ventas de la cooperativa
  async findByCooperativa(cooperativaId: number): Promise<Venta[]> {
    return await this.db
      .select()
      .from(ventas)
      .where(eq(ventas.cooperativaId, cooperativaId));
  }

  // Para oficinistas/admins - obtener ventas por estado de pago de la cooperativa
  async findByCooperativaAndEstadoPago(cooperativaId: number, estadoPago: EstadoPago): Promise<Venta[]> {
    return await this.db
      .select()
      .from(ventas)
      .where(
        and(
          eq(ventas.cooperativaId, cooperativaId),
          eq(ventas.estadoPago, estadoPago)
        )
      );
  }

  // Para oficinistas/admins - obtener ventas por tipo de venta de la cooperativa
  async findByCooperativaAndTipoVenta(cooperativaId: number, tipoVenta: TipoVenta): Promise<Venta[]> {
    return await this.db
      .select()
      .from(ventas)
      .where(
        and(
          eq(ventas.cooperativaId, cooperativaId),
          eq(ventas.tipoVenta, tipoVenta)
        )
      );
  }

  // Para oficinistas - modificar estado de pago de una venta
  async updateEstadoPago(id: number, estadoPago: EstadoPago): Promise<Venta> {
    const [updatedVenta] = await this.db
      .update(ventas)
      .set({ estadoPago })
      .where(eq(ventas.id, id))
      .returning();

    if (!updatedVenta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }
    return updatedVenta;
  }

  // Para clientes - obtener ventas del cliente con estado pagado
  async findByClientePagadas(usuarioId: number): Promise<Venta[]> {
    return await this.db
      .select({
        id: ventas.id,
        cooperativaId: ventas.cooperativaId,
        clienteId: ventas.clienteId,
        oficinistaId: ventas.oficinistaId,
        metodoPagoId: ventas.metodoPagoId,
        hojaTrabajoId: ventas.hojaTrabajoId,
        estadoPago: ventas.estadoPago,
        comprobanteUrl: ventas.comprobanteUrl,
        fechaVenta: ventas.fechaVenta,
        tipoVenta: ventas.tipoVenta,
        totalSinDescuento: ventas.totalSinDescuento,
        totalDescuentos: ventas.totalDescuentos,
        totalFinal: ventas.totalFinal,
        createdAt: ventas.createdAt,
        updatedAt: ventas.updatedAt,
      })
      .from(ventas)
      .innerJoin(clientes, eq(ventas.clienteId, clientes.id))
      .where(
        and(
          eq(clientes.usuarioId, usuarioId),
          eq(ventas.estadoPago, EstadoPago.APROBADO)
        )
      );
  }
} 