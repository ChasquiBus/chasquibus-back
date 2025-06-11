import { Injectable } from '@nestjs/common';
import { db } from '../drizzle/database';
import { cooperativaTransporte } from '../drizzle/schema/cooperativa-transporte';
import { eq, and , isNull } from 'drizzle-orm';
import { CreateCooperativaDto } from './dto/create-cooperativa.dto';
import { UpdateCooperativaDto } from './dto/update-cooperativa.dto';
import { Cooperativa } from './entities/cooperativa.entity';

@Injectable()

export class CooperativasService {
  async create(data: CreateCooperativaDto): Promise<Cooperativa[]> {
    const now = new Date();
    return db
      .insert(cooperativaTransporte)
      .values({
        ...data,
        activo: true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
  }

  async findAll(): Promise<Cooperativa[]> {
    return db
      .select()
      .from(cooperativaTransporte)
      .where(
        and(
          eq(cooperativaTransporte.activo, true),
          isNull(cooperativaTransporte.deletedAt),
        ),
      );
  }

  async findOne(id: number): Promise<Cooperativa | null> {
    const [cooperativa] = await db
      .select()
      .from(cooperativaTransporte)
      .where(
        and(
          eq(cooperativaTransporte.id, id),
          eq(cooperativaTransporte.activo, true),
          isNull(cooperativaTransporte.deletedAt),
        ),
      );
    return cooperativa || null;
  }

  async update(id: number, data: UpdateCooperativaDto): Promise<Cooperativa[]> {
    return db
      .update(cooperativaTransporte)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(cooperativaTransporte.id, id))
      .returning();
  }

  async remove(id: number): Promise<Cooperativa[]> {
    return db
      .update(cooperativaTransporte)
      .set({ activo: false, deletedAt: new Date() })
      .where(eq(cooperativaTransporte.id, id))
      .returning();
  }
}