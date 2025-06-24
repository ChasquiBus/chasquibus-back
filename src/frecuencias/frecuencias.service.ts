import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFrecuenciaDto } from './dto/create-frecuencia.dto';
import { UpdateFrecuenciaDto } from './dto/update-frecuencia.dto';
import { db } from '../drizzle/database';
import { frecuencias } from '../drizzle/schema/frecuencias';
import { rutas } from '../drizzle/schema/rutas';
import { eq, and, isNull } from 'drizzle-orm';

@Injectable()
export class FrecuenciasService {
  async create(dto: CreateFrecuenciaDto) {
    // 1. Crear la frecuencia
    const [frecuencia] = await db
      .insert(frecuencias)
      .values({
        rutaId: dto.rutaId,
        horaSalidaProg: dto.horaSalidaProg,
        horaLlegadaProg: dto.horaLlegadaProg,
        estado: 'inactiva' ,
      })
      .returning();
    // Ya no se insertan días de operación
    return frecuencia;
  }

  async findAllByRutaId(rutaId: number) {
    // Obtener frecuencias por rutaId que no estén eliminadas
    const frecuenciasData = await db
      .select()
      .from(frecuencias)
      .where(and(eq(frecuencias.rutaId, rutaId), isNull(frecuencias.deletedAt)));
    return frecuenciasData;
  }

  async findOne(id: number) {
    // Obtener frecuencia por id que no esté eliminada
    const [frecuencia] = await db
      .select()
      .from(frecuencias)
      .where(and(eq(frecuencias.id, id), isNull(frecuencias.deletedAt)));
    if (!frecuencia) {
      throw new NotFoundException(`Frecuencia con ID ${id} no encontrada`);
    }
    return frecuencia;
  }

  async findAllByCooperativa(cooperativaId: number) {
    // Obtener frecuencias de una cooperativa específica que no estén eliminadas
    const frecuenciasData = await db
      .select()
      .from(frecuencias)
      .innerJoin(rutas, eq(frecuencias.rutaId, rutas.id))
      .where(
        and(
          eq(rutas.cooperativaId, cooperativaId),
          isNull(frecuencias.deletedAt)
        )
      );
    // Retornar solo los datos de frecuencia
    return frecuenciasData.map(f => f.frecuencias);
  }

  async update(id: number, dto: UpdateFrecuenciaDto) {
    // Verificar que la frecuencia existe y no está eliminada
    const [frecuenciaExistente] = await db
      .select()
      .from(frecuencias)
      .where(and(eq(frecuencias.id, id), isNull(frecuencias.deletedAt)));
    if (!frecuenciaExistente) {
      throw new NotFoundException(`Frecuencia con ID ${id} no encontrada`);
    }
    // Preparar datos de actualización
    const updateData: any = {
      updatedAt: new Date()
    };
    if (dto.horaSalidaProg !== undefined) updateData.horaSalidaProg = dto.horaSalidaProg;
    if (dto.horaLlegadaProg !== undefined) updateData.horaLlegadaProg = dto.horaLlegadaProg;
    // Actualizar la frecuencia
    const [frecuenciaActualizada] = await db
      .update(frecuencias)
      .set(updateData)
      .where(eq(frecuencias.id, id))
      .returning();
    return frecuenciaActualizada;
  }

  async remove(id: number) {
    // Verificar que la frecuencia existe y no está eliminada
    const [frecuenciaExistente] = await db
      .select()
      .from(frecuencias)
      .where(and(eq(frecuencias.id, id), isNull(frecuencias.deletedAt)));

    if (!frecuenciaExistente) {
      throw new NotFoundException(`Frecuencia con ID ${id} no encontrada`);
    }

    // Eliminación lógica
    const [frecuenciaEliminada] = await db
      .update(frecuencias)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(frecuencias.id, id))
      .returning();

    return {
      message: `Frecuencia con ID ${id} eliminada exitosamente`,
      frecuencia: frecuenciaEliminada
    };
  }
} 