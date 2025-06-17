import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../drizzle/database';
import { ciudades, provincias } from '../drizzle/schema/ciudades';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProvinciasService {
  async findAllProvincias() {
    return await db.select().from(provincias).orderBy(provincias.nombre);
  }

  async findOne(id: number) {
    const result = await db.select().from(provincias).where(eq(provincias.id, id));
    return result[0] ?? null;
  }

  async findCiudadesByProvincia(idProvincia: number) {
    return await db
      .select({
        id: ciudades.id,
        ciudad: ciudades.ciudad,
        codigo: ciudades.codigo,
      })
      .from(ciudades)
      .where(eq(ciudades.provincia_id, idProvincia))
      .orderBy(ciudades.ciudad);
  }
}