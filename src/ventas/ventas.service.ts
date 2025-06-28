import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { ventas } from '../drizzle/schema/ventas';
import { eq } from 'drizzle-orm';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Venta } from './entities/venta.entity';
import type { Database } from '../drizzle/database';

@Injectable()
export class VentasService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}



  async findAll(): Promise<Venta[]> {
    return await this.db.select().from(ventas);
  }

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

  async findByCooperativa(cooperativaId: number): Promise<Venta[]> {
    return await this.db
      .select()
      .from(ventas)
      .where(eq(ventas.cooperativaId, cooperativaId));
  }

  async findByEstadoPago(estadoPago: string): Promise<Venta[]> {
    return await this.db
      .select()
      .from(ventas)
      .where(eq(ventas.estadoPago, estadoPago));
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const updateData: any = {};

    if (updateVentaDto.cooperativaId !== undefined) {
      updateData.cooperativaId = updateVentaDto.cooperativaId;
    }
    if (updateVentaDto.clienteId !== undefined) {
      updateData.clienteId = updateVentaDto.clienteId;
    }
    if (updateVentaDto.oficinistaId !== undefined) {
      updateData.oficinistaId = updateVentaDto.oficinistaId;
    }
    if (updateVentaDto.metodoPagoId !== undefined) {
      updateData.metodoPagoId = updateVentaDto.metodoPagoId;
    }
    if (updateVentaDto.estadoPago !== undefined) {
      updateData.estadoPago = updateVentaDto.estadoPago;
    }
    if (updateVentaDto.comprobanteUrl !== undefined) {
      updateData.comprobanteUrl = updateVentaDto.comprobanteUrl;
    }
    if (updateVentaDto.fechaVenta !== undefined) {
      updateData.fechaVenta = new Date(updateVentaDto.fechaVenta);
    }
    if (updateVentaDto.tipoVenta !== undefined) {
      updateData.tipoVenta = updateVentaDto.tipoVenta;
    }
    if (updateVentaDto.totalSinDescuento !== undefined) {
      updateData.totalSinDescuento = updateVentaDto.totalSinDescuento;
    }
    if (updateVentaDto.totalDescuentos !== undefined) {
      updateData.totalDescuentos = updateVentaDto.totalDescuentos;
    }
    if (updateVentaDto.totalFinal !== undefined) {
      updateData.totalFinal = updateVentaDto.totalFinal;
    }

    updateData.updatedAt = new Date();

    const [updatedVenta] = await this.db
      .update(ventas)
      .set(updateData)
      .where(eq(ventas.id, id))
      .returning();

    if (!updatedVenta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return updatedVenta;
  }

  async remove(id: number): Promise<void> {
    const [deletedVenta] = await this.db
      .delete(ventas)
      .where(eq(ventas.id, id))
      .returning();

    if (!deletedVenta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }
  }

  async getVentasStats(): Promise<{
    totalVentas: number;
    totalIngresos: number;
    ventasPendientes: number;
    ventasCompletadas: number;
  }> {
    const allVentas = await this.findAll();
    
    const totalVentas = allVentas.length;
    const totalIngresos = allVentas.reduce((sum, venta) => sum + Number(venta.totalFinal), 0);
    const ventasPendientes = allVentas.filter(venta => venta.estadoPago === 'PENDIENTE').length;
    const ventasCompletadas = allVentas.filter(venta => venta.estadoPago === 'COMPLETADO').length;

    return {
      totalVentas,
      totalIngresos,
      ventasPendientes,
      ventasCompletadas,
    };
  }
} 