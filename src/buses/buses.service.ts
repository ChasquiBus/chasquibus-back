
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';

import { eq, and } from 'drizzle-orm';
import { db } from 'drizzle/database';
import { buses } from 'drizzle/schema/bus';

@Injectable()
export class BusesService {
  async create(createBusDto: CreateBusDto) {
    const busToInsert = { ...createBusDto };
    if (!busToInsert.piso_doble) {
      busToInsert.total_asientos_piso2 = null; // Si no es doble piso, el segundo piso es nulo
    }
    return await db.insert(buses).values(busToInsert).returning();
  }

  async findAll(cooperativaId?: number) {
    if (cooperativaId) {
      return await db.select().from(buses).where(eq(buses.cooperativa_id, cooperativaId));
    }
    return await db.select().from(buses);
  }

  async findOne(id: number, cooperativaId?: number) {
    const conditions = [eq(buses.id, id)];
    if (cooperativaId) {
      conditions.push(eq(buses.cooperativa_id, cooperativaId));
    }
    const result = await db.select().from(buses).where(and(...conditions));
    return result[0] || null;
  }

  async update(id: number, updateBusDto: UpdateBusDto, cooperativaId?: number) {
    if (Object.keys(updateBusDto).length === 0) {
      throw new Error('No se proporcionaron valores para actualizar');
    }

    const busToUpdate = { ...updateBusDto };
    // Si se cambia a un solo piso, o si el campo piso_doble se envía como false
    if (busToUpdate.piso_doble === false || (busToUpdate.piso_doble === undefined && !busToUpdate.piso_doble)) {
      busToUpdate.total_asientos_piso2 = null;
    }
    // Si se cambia a doble piso y no se proporciona total_asientos_piso2, o si se intenta actualizar
    // y piso_doble es true pero no hay total_asientos_piso2, deberíamos manejarlo.
    // Aquí asumimos que el frontend enviará total_asientos_piso2 si piso_doble es true.

    const conditions = [eq(buses.id, id)];
    if (cooperativaId) {
      conditions.push(eq(buses.cooperativa_id, cooperativaId));
    }
    return await db.update(buses).set(busToUpdate).where(and(...conditions)).returning();
  }

  async remove(id: number, cooperativaId?: number) {
    const conditions = [eq(buses.id, id)];
    if (cooperativaId) {
      conditions.push(eq(buses.cooperativa_id, cooperativaId));
    }
    
    try {
      // Realizar un soft delete: actualizar deleted_at y activo a false
      const [deletedBus] = await db.update(buses)
        .set({ activo: false, deleted_at: new Date() })
        .where(and(...conditions))
        .returning();

      if (!deletedBus) {
        throw new NotFoundException('Bus no encontrado o no autorizado para eliminar.');
      }

      return deletedBus; // Retornar el bus que fue lógicamente eliminado
    } catch (error) {
      // Capturar cualquier otro error que ocurra durante la operación de la base de datos
      console.error("Error al realizar soft delete del bus:", error);
      // Incluir el mensaje del error original para facilitar el diagnóstico
      throw new InternalServerErrorException(`Error al eliminar el bus: ${error.message || error}.`);
    }
  }
}