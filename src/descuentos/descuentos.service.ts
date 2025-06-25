// descuentos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';
import { descuentos } from '../drizzle/schema/descuentos';
import { db } from 'drizzle/database';
import { eq } from 'drizzle-orm';


@Injectable()
export class DescuentosService {
  async create(dto: CreateDescuentoDto) {
    return db.insert(descuentos).values({
      ...dto,
      porcentaje: dto.porcentaje.toString(),
    }).returning();
  }

  async findAll() {
    return db.select().from(descuentos);
  }

  async findOne(id: number) {
    const result = await db.select().from(descuentos).where(eq(descuentos.id, id));
    if (!result.length) throw new NotFoundException('Descuento no encontrado');
    return result[0];
  }

  async update(id: number, dto: UpdateDescuentoDto) {
    return db.update(descuentos).set({
      ...dto,
      porcentaje: dto.porcentaje?.toString(),
    }).where(eq(descuentos.id, id)).returning();
  }

  async remove(id: number) {
    return db.delete(descuentos).where(eq(descuentos.id, id)).returning();
  }
}
