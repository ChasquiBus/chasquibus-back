import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateRutaParadaDto } from './dto/create-ruta-parada.dto';
import { UpdateRutaParadaDto } from './dto/update-ruta-parada.dto';
import { db } from '../drizzle/database';
import { rutaParada } from '../drizzle/schema/ruta-parada';
import { paradas } from '../drizzle/schema/paradas';
import { rutas } from '../drizzle/schema/rutas';
import { ciudades } from '../drizzle/schema/ciudades';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class RutaParadaService {
  async create(createRutaParadaDto: CreateRutaParadaDto) {
    const { rutaId, paradaId, orden } = createRutaParadaDto;
  
    await this.ensureParadaNotIsOrigenODestino(rutaId, paradaId);
    await this.ensureOrdenIsUniqueInRuta(rutaId, orden);
  
    const [nuevaRutaParada] = await db
      .insert(rutaParada)
      .values({
        ...createRutaParadaDto,
        estado: 'activa',
      })
      .returning();
  
    return nuevaRutaParada;
  }
  
  private async ensureOrdenIsUniqueInRuta(rutaId: number, orden: number) {
    const [existingParada] = await db
      .select()
      .from(rutaParada)
      .where(
        and(
          eq(rutaParada.rutaId, rutaId),
          eq(rutaParada.orden, orden),
          eq(rutaParada.estado, 'activa')
        )
      );
  
    if (existingParada) {
      throw new ConflictException('Ya existe una parada con este orden en la ruta');
    }
  }

  private async ensureParadaNotIsOrigenODestino(rutaId: number, paradaId: number) {
    const [ruta] = await db
      .select({
        paradaOrigenId: rutas.paradaOrigenId,
        paradaDestinoId: rutas.paradaDestinoId,
      })
      .from(rutas)
      .where(eq(rutas.id, rutaId));
  
    if (!ruta) {
      throw new NotFoundException('Ruta no encontrada');
    }
  
    if (paradaId === ruta.paradaOrigenId || paradaId === ruta.paradaDestinoId) {
      throw new ConflictException(
        'La parada no puede ser igual a la parada de origen o destino de la ruta'
      );
    }
  }
  
  private async ensureOrdenIsUniqueInRutaExceptId(rutaId: number, orden: number, excludeId: number) {
    const [existingParada] = await db
      .select()
      .from(rutaParada)
      .where(
        and(
          eq(rutaParada.rutaId, rutaId),
          eq(rutaParada.orden, orden),
          eq(rutaParada.estado, 'activa')
        )
      );
  
    if (existingParada && existingParada.id !== excludeId) {
      throw new ConflictException('Ya existe una parada con este orden en la ruta');
    }
  }

  async findAllParadasFromRutas(rutaId: number) {
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

   async findAllParadasByCooperativa(cooperativaId: number) {
    const rutaParadasList = await db
      .select({
        id: rutaParada.id,
        rutaId: rutaParada.rutaId,
        paradaId: rutaParada.paradaId,
        orden: rutaParada.orden,
        distanciaDesdeOrigenKm: rutaParada.distanciaDesdeOrigenKm,
        tiempoDesdeOrigenMin: rutaParada.tiempoDesdeOrigenMin,
        estado: rutaParada.estado,
        ruta: {
            id: rutas.id,
            codigo: rutas.codigo,
            prioridad: rutas.prioridad,
            resolucionUrl: rutas.resolucionUrl,
            fechaIniVigencia: rutas.fechaIniVigencia,
            fechaFinVigencia: rutas.fechaFinVigencia,
            estado: rutas.estado,
            createdAt: rutas.createdAt,
            updatedAt: rutas.updatedAt,
            deletedAt: rutas.deletedAt,
        }
      })
      .from(rutaParada)
      .innerJoin(rutas, eq(rutaParada.rutaId, rutas.id))
      .where(
        and(
          eq(rutas.cooperativaId, cooperativaId),
          eq(rutaParada.estado, 'activa'),
          eq(rutas.estado, true) // Asegurarse de que la ruta también esté activa
        )
      )
      .orderBy(rutaParada.orden);

    // Obtener información detallada para cada ruta-parada (parada y ciudad)
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

  async update(id: number, updateRutaParadaDto: UpdateRutaParadaDto) {
    const { rutaId, paradaId, orden } = updateRutaParadaDto;
  
    // Validar orden único si se cambia
    if (rutaId && orden !== undefined) {
      await this.ensureOrdenIsUniqueInRutaExceptId(rutaId, orden, id);
    }
  
    if (rutaId && paradaId) {
      await this.ensureParadaNotIsOrigenODestino(rutaId, paradaId);
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