import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../drizzle/database';
import { ciudades, provincias } from '../drizzle/schema/ciudades';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class CiudadesService {
  async findAll() {
    return await db
      .select({
        id: ciudades.id,
        ciudad: ciudades.ciudad,
        codigo: ciudades.codigo,
        provincia: {
          id: provincias.id,
          nombre: provincias.nombre,
        },
      })
      .from(ciudades)
      .leftJoin(provincias, eq(ciudades.provincia_id, provincias.id))
      .orderBy(ciudades.ciudad);
  }

  async findById(id: number) {
    const result = await db
      .select()
      .from(ciudades)
      .where(eq(ciudades.id, id));
    return result[0] ?? null;
  }
}