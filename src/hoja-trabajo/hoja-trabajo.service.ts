import { Injectable } from '@nestjs/common';
import { CreateHojaTrabajoDto } from './dto/create-hoja-trabajo.dto';
import { UpdateHojaTrabajoDto } from './dto/update-hoja-trabajo.dto';
import { db } from '../drizzle/database';
import { hojaTrabajo } from '../drizzle/schema/hoja-trabajo';
import { eq } from 'drizzle-orm';

@Injectable()
export class HojaTrabajoService {
  async create(createHojaTrabajoDto: CreateHojaTrabajoDto) {
    const mapped = {
      busId: createHojaTrabajoDto.bus_id,
      choferId: createHojaTrabajoDto.chofer_id,
      observaciones: createHojaTrabajoDto.observaciones,
      estado: createHojaTrabajoDto.estado,
      // Si tienes controlador_id y lo necesitas en la tabla, agrégalo aquí
    };
    const [created] = await db.insert(hojaTrabajo).values(mapped).returning();
    return { message: 'Hoja de trabajo creada', data: created };
  }

  async findAll() {
    const all = await db.select().from(hojaTrabajo);
    return { message: 'Lista de hojas de trabajo', data: all };
  }

  async findOne(id: number) {
    const [found] = await db.select().from(hojaTrabajo).where(eq(hojaTrabajo.id, id));
    if (!found) {
      return { message: `No se encontró la hoja de trabajo con id ${id}` };
    }
    return { message: `Hoja de trabajo ${id}`, data: found };
  }

  async update(id: number, updateHojaTrabajoDto: UpdateHojaTrabajoDto) {
    const mapped: any = {};
    if (updateHojaTrabajoDto.bus_id !== undefined) mapped.busId = updateHojaTrabajoDto.bus_id;
    if (updateHojaTrabajoDto.chofer_id !== undefined) mapped.choferId = updateHojaTrabajoDto.chofer_id;
    if (updateHojaTrabajoDto.observaciones !== undefined) mapped.observaciones = updateHojaTrabajoDto.observaciones;
    if (updateHojaTrabajoDto.estado !== undefined) mapped.estado = updateHojaTrabajoDto.estado;
    // Si tienes controlador_id y lo necesitas, agrégalo aquí

    const [updated] = await db.update(hojaTrabajo)
      .set(mapped)
      .where(eq(hojaTrabajo.id, id))
      .returning();

    if (!updated) {
      return { message: `No se pudo actualizar la hoja de trabajo con id ${id}` };
    }
    return { message: `Hoja de trabajo ${id} actualizada`, data: updated };
  }

  async remove(id: number) {
    const [deleted] = await db.delete(hojaTrabajo)
      .where(eq(hojaTrabajo.id, id))
      .returning();
    if (!deleted) {
      return { message: `No se pudo eliminar la hoja de trabajo con id ${id}` };
    }
    return { message: `Hoja de trabajo ${id} eliminada`, data: deleted };
  }
} 