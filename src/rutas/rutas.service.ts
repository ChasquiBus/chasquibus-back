import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { db } from '../drizzle/database';
import { rutas } from '../drizzle/schema/rutas';
import { paradas } from '../drizzle/schema/paradas';
import { resolucionesAnt } from '../drizzle/schema/resoluciones-ant';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class RutasService {
  async create(createRutaDto: CreateRutaDto) {
    // Verificar que las paradas sean terminales
    const [paradaOrigen] = await db
      .select()
      .from(paradas)
      .where(
        and(
          eq(paradas.id, createRutaDto.paradaOrigenId),
          eq(paradas.esTerminal, true)
        )
      );

    const [paradaDestino] = await db
      .select()
      .from(paradas)
      .where(
        and(
          eq(paradas.id, createRutaDto.paradaDestinoId),
          eq(paradas.esTerminal, true)
        )
      );

    if (!paradaOrigen || !paradaDestino) {
      throw new BadRequestException('Las paradas de origen y destino deben ser terminales');
    }

    // Verificar que la resolución no esté en uso
    const [resolucion] = await db
      .select()
      .from(resolucionesAnt)
      .where(
        and(
          eq(resolucionesAnt.id, createRutaDto.resolucionId),
          eq(resolucionesAnt.estado, true)
        )
      );

    if (!resolucion) {
      throw new BadRequestException('La resolución no existe o no está activa');
    }

    if (resolucion.enUso) {
      throw new BadRequestException('Esta resolución ya está siendo usada');
    }

    // Crear la ruta
    const [ruta] = await db.insert(rutas).values({
      ...createRutaDto,
      estado: true,
    }).returning();

    // Actualizar el estado enUso de la resolución
    await db
      .update(resolucionesAnt)
      .set({ enUso: true })
      .where(eq(resolucionesAnt.id, createRutaDto.resolucionId));

    return ruta;
  }

  async findAll(cooperativaTransporteId: number) {
    if (!cooperativaTransporteId) {
      throw new BadRequestException('Se requiere el ID de la cooperativa para listar las rutas');
    }

    return await db
      .select()
      .from(rutas)
      .where(
        and(
          eq(rutas.cooperativaId, cooperativaTransporteId),
          eq(rutas.estado, true)
        )
      );
  }

  async findOne(id: number) {
    const [ruta] = await db
      .select()
      .from(rutas)
      .where(
        and(
          eq(rutas.id, id),
          eq(rutas.estado, true)
        )
      );
    return ruta;
  }

  async update(id: number, updateRutaDto: UpdateRutaDto) {
    const [ruta] = await db
      .update(rutas)
      .set({
        ...updateRutaDto,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(rutas.id, id),
          eq(rutas.estado, true)
        )
      )
      .returning();

    return ruta;
  }

  async remove(id: number) {
    const [ruta] = await db
      .select()
      .from(rutas)
      .where(
        and(
          eq(rutas.id, id),
          eq(rutas.estado, true)
        )
      );

    if (ruta) {
      // Liberar la resolución
      if (ruta.resolucionId) {
        await db
          .update(resolucionesAnt)
          .set({ enUso: false })
          .where(eq(resolucionesAnt.id, ruta.resolucionId));
      }

      // Soft delete de la ruta
      await db
        .update(rutas)
        .set({ 
          estado: false,
          deletedAt: new Date() 
        })
        .where(eq(rutas.id, id));
    }

    return { message: 'Ruta eliminada correctamente' };
  }
}
