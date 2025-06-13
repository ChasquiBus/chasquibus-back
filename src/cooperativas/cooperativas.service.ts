import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { db } from '../drizzle/database';
import { cooperativaTransporte } from '../drizzle/schema/cooperativa-transporte';
import { eq, and , isNull } from 'drizzle-orm';
import { CreateCooperativaDto } from './dto/create-cooperativa.dto';
import { UpdateCooperativaDto } from './dto/update-cooperativa.dto';
import { Cooperativa } from './entities/cooperativa.entity';
import { usuarioCooperativa } from '../drizzle/schema/usuario-cooperativa';

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

  async findAll(isSuperAdmin: boolean = false): Promise<Cooperativa[]> {
    if (isSuperAdmin) {
      return db
        .select()
        .from(cooperativaTransporte);
    } else {
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

  async update(id: number, data: UpdateCooperativaDto, adminCooperativaId?: number): Promise<Cooperativa[]> {
    // Si es un admin, verificamos que esté intentando modificar su propia cooperativa
    if (adminCooperativaId !== undefined) {
      const [adminCooperativa] = await db
        .select()
        .from(usuarioCooperativa)
        .where(eq(usuarioCooperativa.usuarioId, adminCooperativaId))
        .limit(1);

      if (!adminCooperativa) {
        throw new NotFoundException('No se encontró la cooperativa asociada al administrador.');
      }

      if (adminCooperativa.cooperativaTransporteId !== id) {
        throw new ForbiddenException('No tienes permiso para modificar esta cooperativa.');
      }
    }

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