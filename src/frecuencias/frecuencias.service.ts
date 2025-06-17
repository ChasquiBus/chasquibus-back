import { Injectable } from '@nestjs/common';
import { CreateFrecuenciaDto } from './dto/create-frecuencia.dto';
import { UpdateFrecuenciaDto } from './dto/update-frecuencia.dto';
import { db } from '../drizzle/database';
import { frecuencias } from '../drizzle/schema/frecuencias';
import { eq } from 'drizzle-orm';

@Injectable()
export class FrecuenciasService {
async create(createFrecuenciaDto: CreateFrecuenciaDto) {
  const [created] = await db.insert(frecuencias).values({
    rutaId: createFrecuenciaDto.rutaId,
    horaSalidaProg: createFrecuenciaDto.horaSalidaProg,
    horaLlegadaProg: createFrecuenciaDto.horaLlegadaProg,
    estado: createFrecuenciaDto.estado,
  }).returning();

  return { message: 'Frecuencia creada', data: created };
}

  async findAll(cooperativaId?: number) {
    // Si quieres filtrar por cooperativaId, deberías hacer join con rutas y cooperativas
    // Por ahora, devolvemos todas las frecuencias
    const all = await db.select().from(frecuencias);
    return { message: 'Lista de frecuencias', data: all };
  }

  async findOne(id: number) {
    const [found] = await db.select().from(frecuencias).where(eq(frecuencias.id, id));
    if (!found) {
      return { message: `No se encontró la frecuencia con id ${id}` };
    }
    return { message: `Frecuencia ${id}`, data: found };
  }

  async update(id: number, updateFrecuenciaDto: UpdateFrecuenciaDto) {
    const [updated] = await db.update(frecuencias)
      .set(updateFrecuenciaDto)
      .where(eq(frecuencias.id, id))
      .returning();
    if (!updated) {
      return { message: `No se pudo actualizar la frecuencia con id ${id}` };
    }
    return { message: `Frecuencia ${id} actualizada`, data: updated };
  }

  async remove(id: number) {
    const [deleted] = await db.delete(frecuencias)
      .where(eq(frecuencias.id, id))
      .returning();
    if (!deleted) {
      return { message: `No se pudo eliminar la frecuencia con id ${id}` };
    }
    return { message: `Frecuencia ${id} eliminada`, data: deleted };
  }
} 