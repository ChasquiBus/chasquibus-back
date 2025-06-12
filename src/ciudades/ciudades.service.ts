import { Injectable } from '@nestjs/common';
import { db } from '../drizzle/database';
import { ciudades } from '../drizzle/schema/ciudades';
import { eq } from 'drizzle-orm';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { Ciudad } from './entities/ciudad.entity';

@Injectable()
export class CiudadesService {
  async create(data: CreateCiudadDto): Promise<Ciudad[]> {
    return db
      .insert(ciudades)
      .values(data)
      .returning();
  }

  async findAll(): Promise<Ciudad[]> {
    return db.select().from(ciudades);
  }

  async findOne(id: number): Promise<Ciudad | null> {
    const [ciudad] = await db
      .select()
      .from(ciudades)
      .where(eq(ciudades.id, id));
    return ciudad || null;
  }

  async update(id: number, data: UpdateCiudadDto): Promise<Ciudad[]> {
    return db
      .update(ciudades)
      .set(data)
      .where(eq(ciudades.id, id))
      .returning();
  }

  async remove(id: number): Promise<Ciudad[]> {
    return db
      .delete(ciudades)
      .where(eq(ciudades.id, id))
      .returning();
  }
}
