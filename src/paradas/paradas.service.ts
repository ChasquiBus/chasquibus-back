import { Injectable } from '@nestjs/common';
import { db } from '../drizzle/database';
import { paradas } from '../drizzle/schema/paradas';
import { ciudades } from '../drizzle/schema/ciudades';
import { eq } from 'drizzle-orm';
import { CreateParadaDto } from './dto/create-parada.dto';
import { UpdateParadaDto } from './dto/update-parada.dto';
import { Parada } from './entities/parada.entity';

@Injectable()
export class ParadasService {
  async create(data: CreateParadaDto): Promise<Parada[]> {
    return db.insert(paradas).values(data).returning();
  }

  async findAll(): Promise<Parada[]> {
    const rows = await db
      .select({
        id: paradas.id,
        ciudadId: paradas.ciudadId,
        nombreParada: paradas.nombreParada,
        direccion: paradas.direccion,
        estado: paradas.estado,
        esTerminal: paradas.esTerminal,
        ciudad: {
          id: ciudades.id,
          provincia: ciudades.provincia,
          ciudad: ciudades.ciudad,
        },
      })
      .from(paradas)
      .leftJoin(ciudades, eq(paradas.ciudadId, ciudades.id));

    return rows;
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
        ciudad: {
          id: ciudades.id,
          provincia: ciudades.provincia,
          ciudad: ciudades.ciudad,
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
    return db.delete(paradas).where(eq(paradas.id, id)).returning();
  }
}
