import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../drizzle/database';
import { paradas } from '../drizzle/schema/paradas';
import { ciudades } from '../drizzle/schema/ciudades';
import { eq, and, isNull } from 'drizzle-orm';
import { CreateParadaDto } from './dto/create-parada.dto';
import { UpdateParadaDto } from './dto/update-parada.dto';
import { Parada } from './entities/parada.entity';
import type { InferSelectModel } from 'drizzle-orm';

@Injectable()
export class ParadasService {
  async create(data: CreateParadaDto): Promise<Parada[]> {
    return db.insert(paradas)
    .values({...data, estado: true})
    .returning();
  }

  async findAll(cooperativaId: number, includeDeleted: boolean = false): Promise<InferSelectModel<typeof paradas>[]> {
    const baseQuery = db
      .select({
        id: paradas.id,
        ciudadId: paradas.ciudadId,
        nombreParada: paradas.nombreParada,
        direccion: paradas.direccion,
        estado: paradas.estado,
        esTerminal: paradas.esTerminal,
        cooperativaId: paradas.cooperativaId,
        ciudad: {
          id: ciudades.id,
          provincia_id: ciudades.provincia_id,
          ciudad: ciudades.ciudad,
          codigo: ciudades.codigo,
        },
      })
      .from(paradas)
      .innerJoin(ciudades, eq(paradas.ciudadId, ciudades.id))
      .where(
        and(
          eq(paradas.cooperativaId, cooperativaId),
          ...(includeDeleted ? [] : [
            eq(paradas.estado, true)
          ])
        )
      );

    return baseQuery;
  }

  async findOne(id: number): Promise<Parada | null> {
    const [row] = await db
      .select({
        id: paradas.id,
        ciudadId: paradas.ciudadId,
        nombreParada: paradas.nombreParada,
        direccion: paradas.direccion,
        estado: paradas.estado,
        esTerminal: paradas.esTerminal,
        cooperativaId: paradas.cooperativaId,
        ciudad: {
          id: ciudades.id,
          provincia_id: ciudades.provincia_id,
          ciudad: ciudades.ciudad,
          codigo: ciudades.codigo,
        },
      })
      .from(paradas)
      .leftJoin(ciudades, eq(paradas.ciudadId, ciudades.id))
      .where(eq(paradas.id, id));

    return row || null;
  }


  async update(id: number, data: UpdateParadaDto): Promise<Parada[]> {
    return db.update(paradas).set(data).where(eq(paradas.id, id)).returning();
  }

  async remove(id: number): Promise<Parada[]> {
    return db.update(paradas)
      .set({ estado: false }) // no se elimina, solo se marca como inactiva
      .where(eq(paradas.id, id))
      .returning();
  }
}
