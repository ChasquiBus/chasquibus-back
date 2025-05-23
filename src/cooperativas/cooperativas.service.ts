import { Injectable } from '@nestjs/common';
import { db } from '../drizzle/database';
import { cooperativaTransporte } from '../drizzle/schema/cooperativa-transporte';
import { eq } from 'drizzle-orm';
import { CreateCooperativaDto } from './dto/create-cooperativa.dto';
import { UpdateCooperativaDto } from './dto/update-cooperativa.dto';

@Injectable()
export class CooperativasService {
  create(data: CreateCooperativaDto) {
    return db.insert(cooperativaTransporte).values(data).returning();
  }

  findAll() {
    return db
      .select()
      .from(cooperativaTransporte)
      .where(eq(cooperativaTransporte.activo, true));
  }

  findOne(id: number) {
    return db
      .select()
      .from(cooperativaTransporte)
      .where(eq(cooperativaTransporte.id, id));
  }

  update(id: number, data: UpdateCooperativaDto) {
    return db
      .update(cooperativaTransporte)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(cooperativaTransporte.id, id))
      .returning();
  }
  remove(id: number) {
    return db
      .update(cooperativaTransporte)
      .set({ activo: false, deletedAt: new Date() })
      .where(eq(cooperativaTransporte.id, id))
      .returning();
  }
}
