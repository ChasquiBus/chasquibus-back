import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../drizzle/database';
import { ciudades } from '../drizzle/schema/ciudades';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { eq, and } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

@Injectable()
export class CiudadesService {
  async findAll(cooperativaId: number): Promise<InferSelectModel<typeof ciudades>[]> {
    const baseQuery = db
      .select()
      .from(ciudades)
      .where(eq(ciudades.cooperativaId, cooperativaId));

    return baseQuery;
  }

  async findOne(id: number) {
    const [ciudad] = await db
      .select()
      .from(ciudades)
      .where(eq(ciudades.id, id))
      .limit(1);

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${id} no encontrada`);
    }

    return ciudad;
  }

  async create(createCiudadDto: CreateCiudadDto) {
    const [ciudad] = await db
      .insert(ciudades)
      .values(createCiudadDto)
      .returning();

    return ciudad;
  }

  async update(id: number, updateCiudadDto: UpdateCiudadDto) {
    const [ciudad] = await db
      .update(ciudades)
      .set(updateCiudadDto)
      .where(eq(ciudades.id, id))
      .returning();

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${id} no encontrada`);
    }

    return ciudad;
  }

  async remove(id: number) {
    const [ciudad] = await db
      .delete(ciudades)
      .where(eq(ciudades.id, id))
      .returning();

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${id} no encontrada`);
    }

    return ciudad;
  }
}
