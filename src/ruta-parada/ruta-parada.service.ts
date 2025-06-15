import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateRutaParadaDto } from './dto/create-ruta-parada.dto';
import { UpdateRutaParadaDto } from './dto/update-ruta-parada.dto';
import { db } from '../drizzle/database';
import { rutaParada } from '../drizzle/schema/ruta-parada';
import { paradas } from '../drizzle/schema/paradas';
import { ciudades } from '../drizzle/schema/ciudades';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class RutaParadaService {
  async create(createRutaParadaDto: CreateRutaParadaDto) {
    // Verificar si ya existe una parada con el mismo orden en la ruta
    const [existingParada] = await db
      .select()
      .from(rutaParada)
      .where(
        and(
          eq(rutaParada.rutaId, createRutaParadaDto.rutaId),
          eq(rutaParada.orden, createRutaParadaDto.orden),
          eq(rutaParada.estado, 'activa')
        )
      );

    if (existingParada) {
      throw new ConflictException('Ya existe una parada con este orden en la ruta');
    }

    // Crear la nueva rutaParada
    const [nuevaRutaParada] = await db
      .insert(rutaParada)
      .values({
        ...createRutaParadaDto,
        estado: 'activa',
      })
      .returning();

    return nuevaRutaParada;
  }

  async findAll(rutaId: number) {
    if (!rutaId) {
      throw new BadRequestException('Se requiere el ID de la ruta para listar las paradas');
    }

    const rutaParadasList = await db
      .select()
      .from(rutaParada)
      .where(
        and(
          eq(rutaParada.rutaId, rutaId),
          eq(rutaParada.estado, 'activa')
        )
      )
      .orderBy(rutaParada.orden);

    // Obtener información detallada para cada ruta-parada
    const rutaParadasConDetalles = await Promise.all(
      rutaParadasList.map(async (rutaParadaItem) => {
        let parada: typeof paradas.$inferSelect | undefined = undefined;
        let ciudad: typeof ciudades.$inferSelect | undefined = undefined;

        if (rutaParadaItem.paradaId) {
          [parada] = await db
            .select()
            .from(paradas)
            .where(eq(paradas.id, rutaParadaItem.paradaId));

          if (parada?.ciudadId) {
            [ciudad] = await db
              .select()
              .from(ciudades)
              .where(eq(ciudades.id, parada.ciudadId));
          }
        }

        return {
          ...rutaParadaItem,
          parada: parada ? {
            ...parada,
            ciudad
          } : undefined
        };
      })
    );

    return rutaParadasConDetalles;
  }

  async findOne(id: number) {
    const [rutaParadaItem] = await db
      .select()
      .from(rutaParada)
      .where(
        and(
          eq(rutaParada.id, id),
          eq(rutaParada.estado, 'activa')
        )
      );
    return rutaParadaItem;
  }

  async update(id: number, updateRutaParadaDto: UpdateRutaParadaDto) {
    // Si se está actualizando el orden, verificar que no exista otro con el mismo orden
    if (updateRutaParadaDto.orden && updateRutaParadaDto.rutaId) {
      const [existingParada] = await db
        .select()
        .from(rutaParada)
        .where(
          and(
            eq(rutaParada.rutaId, updateRutaParadaDto.rutaId),
            eq(rutaParada.orden, updateRutaParadaDto.orden),
            eq(rutaParada.estado, 'activa')
          )
        );

      if (existingParada && existingParada.id !== id) {
        throw new ConflictException('Ya existe una parada con este orden en la ruta');
      }
    }

    const [rutaParadaItem] = await db
      .update(rutaParada)
      .set(updateRutaParadaDto)
      .where(
        and(
          eq(rutaParada.id, id),
          eq(rutaParada.estado, 'activa')
        )
      )
      .returning();

    return rutaParadaItem;
  }

  async remove(id: number) {
    const [rutaParadaItem] = await db
      .update(rutaParada)
      .set({ estado: 'inactiva' })
      .where(eq(rutaParada.id, id))
      .returning();

    return { message: 'Parada eliminada de la ruta correctamente' };
  }
} 