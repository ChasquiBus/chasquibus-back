import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateHojaTrabajoDto } from './dto/create-hoja-trabajo.dto';
import { UpdateHojaTrabajoDto } from './dto/update-hoja-trabajo.dto';
import { db } from '../drizzle/database';
import { hojaTrabajo } from '../drizzle/schema/hoja-trabajo';
import { buses } from '../drizzle/schema/bus';
import { choferes } from '../drizzle/schema/choferes';
import { eq, and, desc, inArray, ne } from 'drizzle-orm';
import { frecuencias } from '../drizzle/schema/frecuencias';
import { rutas } from '../drizzle/schema/rutas';
import { paradas } from '../drizzle/schema/paradas';
import { ciudades } from '../drizzle/schema/ciudades';
import { configuracionAsientos } from '../drizzle/schema/configuracion-asientos';
import { cooperativaTransporte } from '../drizzle/schema/cooperativa-transporte';
import { HojaTrabajoDetalladaDto } from './dto/hoja-trabajo-detallada.dto';
import { usuarios } from '../drizzle/schema/usuarios';

@Injectable()
export class HojaTrabajoService {
  async create(createHojaTrabajoDto: CreateHojaTrabajoDto) {
    // Validar que el bus existe
    const [bus] = await db.select().from(buses).where(eq(buses.id, createHojaTrabajoDto.busId));
    if (!bus) {
      throw new BadRequestException(`El bus con ID ${createHojaTrabajoDto.busId} no existe`);
    }

    // Validar que el chofer existe
    const [chofer] = await db.select().from(choferes).where(eq(choferes.id, createHojaTrabajoDto.choferId));
    if (!chofer) {
      throw new BadRequestException(`El chofer con ID ${createHojaTrabajoDto.choferId} no existe`);
    }

    /*
    const [frecDia] = await db.select().from(frecuenciaDias).where(eq(frecuenciaDias.id, createHojaTrabajoDto.frecDiaId));
    if (!frecDia) {
      throw new BadRequestException(`La frecuencia del día con ID ${createHojaTrabajoDto.frecDiaId} no existe`);
    }
*/
    // Preparar los datos para inserción
    const insertData: any = {
      busId: createHojaTrabajoDto.busId,
      choferId: createHojaTrabajoDto.choferId,
      frecDiaId: createHojaTrabajoDto.frecDiaId,
      estado: createHojaTrabajoDto.estado,
    };

    if (createHojaTrabajoDto.observaciones) {
      insertData.observaciones = createHojaTrabajoDto.observaciones;
    }

    if (createHojaTrabajoDto.horaSalidaReal) {
      insertData.horaSalidaReal = new Date(createHojaTrabajoDto.horaSalidaReal);
    }

    if (createHojaTrabajoDto.horaLlegadaReal) {
      insertData.horaLlegadaReal = new Date(createHojaTrabajoDto.horaLlegadaReal);
    }

    if (createHojaTrabajoDto.fechaSalida) {
      insertData.fechaSalida = new Date(createHojaTrabajoDto.fechaSalida);
    }

    const [created] = await db.insert(hojaTrabajo).values(insertData).returning();

    return { 
      message: 'Hoja de trabajo creada exitosamente', 
      data: created 
    };
  }

  async update(id: number, updateHojaTrabajoDto: UpdateHojaTrabajoDto) {
    // Verificar que la hoja de trabajo existe
    const [existing] = await db.select().from(hojaTrabajo).where(eq(hojaTrabajo.id, id));
    if (!existing) {
      throw new NotFoundException(`No se encontró la hoja de trabajo con ID ${id}`);
    }

    // Solo permitir update si el estado es 'programado'
    if (existing.estado !== 'programado') {
      throw new BadRequestException(`No se puede actualizar una hoja de trabajo con estado '${existing.estado}'. Solo se permite actualizar hojas en estado 'programado'`);
    }

    // Validar referencias si se están actualizando
    if (updateHojaTrabajoDto.busId !== undefined) {
      const [bus] = await db.select().from(buses).where(eq(buses.id, updateHojaTrabajoDto.busId));
      if (!bus) {
        throw new BadRequestException(`El bus con ID ${updateHojaTrabajoDto.busId} no existe`);
      }
      // Verificar que el bus no esté en uso
      if (bus.enUso) {
        throw new BadRequestException(`El bus con ID ${updateHojaTrabajoDto.busId} está en uso y no puede ser asignado`);
      }
    }

    if (updateHojaTrabajoDto.choferId !== undefined) {
      const [chofer] = await db.select().from(choferes).where(eq(choferes.id, updateHojaTrabajoDto.choferId));
      if (!chofer) {
        throw new BadRequestException(`El chofer con ID ${updateHojaTrabajoDto.choferId} no existe`);
      }
    }

    // Verificar que el chofer no esté asignado en la fecha de salida
    const fechaSalida = updateHojaTrabajoDto.fechaSalida ? new Date(updateHojaTrabajoDto.fechaSalida).toISOString().split('T')[0] : existing.fechaSalida;
    const choferId = updateHojaTrabajoDto.choferId || existing.choferId;
    
    if (fechaSalida && choferId) {
      const choferAsignado = await db.select().from(hojaTrabajo)
        .where(and(
          eq(hojaTrabajo.choferId, choferId),
          eq(hojaTrabajo.fechaSalida, fechaSalida),
          ne(hojaTrabajo.id, id)
        ));
      
      if (choferAsignado.length > 0) {
        throw new BadRequestException(`El chofer ya está asignado en la fecha ${fechaSalida}`);
      }
    }

    // Verificar que la frecuencia sea única para esa fecha
    const frecDiaId = updateHojaTrabajoDto.frecDiaId || existing.frecDiaId;
    
    if (fechaSalida && frecDiaId) {
      const frecuenciaAsignada = await db.select().from(hojaTrabajo)
        .where(and(
          eq(hojaTrabajo.frecDiaId, frecDiaId),
          eq(hojaTrabajo.fechaSalida, fechaSalida),
          ne(hojaTrabajo.id, id)
        ));
      
      if (frecuenciaAsignada.length > 0) {
        throw new BadRequestException(`La frecuencia ya está asignada en la fecha ${fechaSalida}`);
      }
    }

    // Preparar los datos para actualización
    const updateData: any = {};
    
    if (updateHojaTrabajoDto.busId !== undefined) updateData.busId = updateHojaTrabajoDto.busId;
    if (updateHojaTrabajoDto.choferId !== undefined) updateData.choferId = updateHojaTrabajoDto.choferId;
    if (updateHojaTrabajoDto.frecDiaId !== undefined) updateData.frecDiaId = updateHojaTrabajoDto.frecDiaId;
    if (updateHojaTrabajoDto.observaciones !== undefined) updateData.observaciones = updateHojaTrabajoDto.observaciones;
    if (updateHojaTrabajoDto.estado !== undefined) updateData.estado = updateHojaTrabajoDto.estado;
    
    if (updateHojaTrabajoDto.horaSalidaReal !== undefined) {
      updateData.horaSalidaReal = new Date(updateHojaTrabajoDto.horaSalidaReal);
    }
    
    if (updateHojaTrabajoDto.horaLlegadaReal !== undefined) {
      updateData.horaLlegadaReal = new Date(updateHojaTrabajoDto.horaLlegadaReal);
    }
    
    if (updateHojaTrabajoDto.fechaSalida !== undefined) {
      updateData.fechaSalida = new Date(updateHojaTrabajoDto.fechaSalida);
    }

    const [updated] = await db.update(hojaTrabajo)
      .set(updateData)
      .where(eq(hojaTrabajo.id, id))
      .returning();

    return { 
      message: `Hoja de trabajo ${id} actualizada exitosamente`, 
      data: updated 
    };
  }

  async remove(id: number) {
    // Verificar que la hoja de trabajo existe
    const [existing] = await db.select().from(hojaTrabajo).where(eq(hojaTrabajo.id, id));
    if (!existing) {
      throw new NotFoundException(`No se encontró la hoja de trabajo con ID ${id}`);
    }

    // Solo permitir delete si el estado no es 'en curso' o 'finalizado'
    if (existing.estado === 'en curso' || existing.estado === 'finalizado') {
      throw new BadRequestException(`No se puede eliminar una hoja de trabajo con estado '${existing.estado}'. Solo se permite eliminar hojas en estado 'programado', 'suspendido' o 'cancelado'`);
    }

    const [deleted] = await db.delete(hojaTrabajo)
      .where(eq(hojaTrabajo.id, id))
      .returning();

    return { 
      message: `Hoja de trabajo ${id} eliminada exitosamente`, 
      data: deleted 
    };
  }

  async findByEstado(estado: string) {
    const hojas = await db.select().from(hojaTrabajo).where(eq(hojaTrabajo.estado, estado));
    return { 
      message: `Hojas de trabajo con estado ${estado}`, 
      data: hojas,
      count: hojas.length
    };
  }

  // Función privada para obtener los detalles de una hoja de trabajo
  private async mapHojaTrabajoDetalle(hoja: typeof hojaTrabajo.$inferSelect): Promise<HojaTrabajoDetalladaDto> {
    // 2. Obtener datos del bus
    const [bus] = await db.select().from(buses).where(eq(buses.id, hoja.busId));
    // 3. Configuración de asientos
    const [configAsientos] = await db.select().from(configuracionAsientos).where(eq(configuracionAsientos.busId, hoja.busId));
    // 4. Frecuencia
    const [frecuencia] = await db.select().from(frecuencias).where(eq(frecuencias.id, hoja.frecDiaId));
    // 5. Ruta
    const [ruta] = frecuencia ? await db.select().from(rutas).where(eq(rutas.id, frecuencia.rutaId)) : [null];
    // 6. Paradas origen y destino
    const [paradaOrigen] = ruta ? await db.select().from(paradas).where(eq(paradas.id, ruta.paradaOrigenId)) : [null];
    const [paradaDestino] = ruta ? await db.select().from(paradas).where(eq(paradas.id, ruta.paradaDestinoId)) : [null];
    // 7. Ciudades origen y destino
    let ciudadOrigen: typeof ciudades.$inferSelect | undefined = undefined;
    if (paradaOrigen && paradaOrigen.ciudadId != null) {
      [ciudadOrigen] = await db.select().from(ciudades).where(eq(ciudades.id, paradaOrigen.ciudadId));
    }
    let ciudadDestino: typeof ciudades.$inferSelect | undefined = undefined;
    if (paradaDestino && paradaDestino.ciudadId != null) {
      [ciudadDestino] = await db.select().from(ciudades).where(eq(ciudades.id, paradaDestino.ciudadId));
    }
    // 8. Cooperativa
    const [cooperativa] = ruta ? await db.select().from(cooperativaTransporte).where(eq(cooperativaTransporte.id, ruta.cooperativaId)) : [null];

    return {
      id: hoja.id,
      placa: bus?.placa ?? '',
      imagen: bus?.imagen ?? '',
      piso_doble: bus?.piso_doble ?? false,
      total_asientos: bus?.total_asientos ?? 0,
      total_asientos_piso2: bus?.total_asientos_piso2 ?? undefined,
      horaSalidaProg: frecuencia?.horaSalidaProg ?? '',
      horaLlegadaProg: frecuencia?.horaLlegadaProg ?? '',
      fechaSalida: hoja.fechaSalida ?? undefined,
      codigo: ruta?.codigo ?? '',
      ciudad_origen: ciudadOrigen?.ciudad ?? '',
      ciudad_destino: ciudadDestino?.ciudad ?? '',
      nombre_cooperativa: cooperativa?.nombre ?? '',
      logo: cooperativa?.logo ?? '',
      estado: hoja.estado,
      idBus: bus?.id ?? 0,
      idCooperativa: cooperativa?.id ?? 0,
      rutaId: ruta?.id ?? 0,
      idFrecuencia: hoja?.frecDiaId ?? 0,
    };
  }

  async getAll(estado?: string): Promise<{ message: string, data: HojaTrabajoDetalladaDto[], count: number }> {
    const estadosPermitidos = ['programado', 'en curso'];
  
    let hojas;
  
    if (estado) {
      if (!estadosPermitidos.includes(estado)) {
        throw new Error(`Estado '${estado}' no permitido. Debe ser 'programado' o 'en curso'.`);
      }
  
      hojas = await db
        .select()
        .from(hojaTrabajo)
        .where(eq(hojaTrabajo.estado, estado));
    } else {
      hojas = await db
        .select()
        .from(hojaTrabajo)
        .where(inArray(hojaTrabajo.estado, estadosPermitidos));
    }
  
    const resultado: HojaTrabajoDetalladaDto[] = [];
    for (const hoja of hojas) {
      resultado.push(await this.mapHojaTrabajoDetalle(hoja));
    }
  
    return {
      message: 'Lista detallada de hojas de trabajo obtenida exitosamente',
      data: resultado,
      count: resultado.length,
    };
  }
  

  async getById(id: number): Promise<{ message: string, data: HojaTrabajoDetalladaDto }> {
    const [hoja] = await db.select().from(hojaTrabajo).where(eq(hojaTrabajo.id, id));
    if (!hoja) {
      throw new NotFoundException(`No se encontró la hoja de trabajo con ID ${id}`);
    }
    const detalle = await this.mapHojaTrabajoDetalle(hoja);
    return {
      message: `Hoja de trabajo ${id} encontrada`,
      data: detalle
    };
  }

  async findByCooperativaId(cooperativaId: number): Promise<{ message: string, data: HojaTrabajoDetalladaDto[], count: number }> {
    // 1. Buscar rutas de la cooperativa
    const rutasCoop = await db.select().from(rutas).where(eq(rutas.cooperativaId, cooperativaId));
    const rutasIds = rutasCoop.map(r => r.id);
    if (rutasIds.length === 0) {
      return { message: 'No hay hojas de trabajo para esta cooperativa', data: [], count: 0 };
    }
    // 2. Buscar frecuencias de esas rutas
    const frecuenciasCoop = await db.select().from(frecuencias).where(inArray(frecuencias.rutaId, rutasIds));
    const frecuenciasIds = frecuenciasCoop.map(f => f.id);
    if (frecuenciasIds.length === 0) {
      return { message: 'No hay hojas de trabajo para esta cooperativa', data: [], count: 0 };
    }
    // 3. Buscar hojas de trabajo de esas frecuencias
    const hojas = await db.select().from(hojaTrabajo).where(inArray(hojaTrabajo.frecDiaId, frecuenciasIds));
    const resultado: HojaTrabajoDetalladaDto[] = [];
    for (const hoja of hojas) {
      resultado.push(await this.mapHojaTrabajoDetalle(hoja));
    }
    return {
      message: 'Lista de hojas de trabajo de la cooperativa obtenida exitosamente',
      data: resultado,
      count: resultado.length
    };
  }

  async findProgramadasByChoferId(userId: number): Promise<{ message: string, data: HojaTrabajoDetalladaDto[], count: number }> {
    // Obtener el chofer asociado al usuario
    const [chofer] = await db.select().from(choferes).where(eq(choferes.usuarioId, userId));
    if (!chofer) {
      return { message: 'No se encontró un chofer asociado a este usuario', data: [], count: 0 };
    }

    // Obtener datos del usuario para el nombre
    const [usuario] = await db.select().from(usuarios).where(eq(usuarios.id, chofer.usuarioId));

    // Obtener hojas de trabajo programadas para este chofer
    const hojas = await db.select().from(hojaTrabajo)
      .where(and(
        eq(hojaTrabajo.choferId, chofer.id),
        eq(hojaTrabajo.estado, 'programado')
      ));

    // Mapear cada hoja a su versión detallada
    const hojasDetalladas = await Promise.all(hojas.map(hoja => this.mapHojaTrabajoDetalle(hoja)));

    return {
      message: `Hojas de trabajo programadas para el chofer ${usuario?.nombre || ''} ${usuario?.apellido || ''}`,
      data: hojasDetalladas,
      count: hojasDetalladas.length
    };
  }

  async findByCiudades(ciudadOrigen: string, ciudadDestino: string): Promise<{ message: string, data: HojaTrabajoDetalladaDto[], count: number }> {
    // Formar el código de la ruta concatenando las ciudades con un guión
    const codigoRuta = `${ciudadOrigen}-${ciudadDestino}`;

    // Buscar rutas que coincidan con el código formado
    const rutasEncontradas = await db.select().from(rutas).where(eq(rutas.codigo, codigoRuta));

    if (rutasEncontradas.length === 0) {
      return { 
        message: `No se encontraron rutas con código ${codigoRuta}`, 
        data: [], 
        count: 0 
      };
    }

    // Obtener IDs de las rutas encontradas
    const rutaIds = rutasEncontradas.map(r => r.id);

    // Buscar frecuencias asociadas a esas rutas
    const frecuenciasEncontradas = await db.select().from(frecuencias).where(inArray(frecuencias.rutaId, rutaIds));

    if (frecuenciasEncontradas.length === 0) {
      return { 
        message: `No se encontraron frecuencias para las rutas con código ${codigoRuta}`, 
        data: [], 
        count: 0 
      };
    }

    // Obtener IDs de las frecuencias
    const frecuenciaIds = frecuenciasEncontradas.map(f => f.id);

    // Buscar hojas de trabajo asociadas a esas frecuencias
    const hojas = await db.select().from(hojaTrabajo).where(inArray(hojaTrabajo.frecDiaId, frecuenciaIds));

    if (hojas.length === 0) {
      return { 
        message: `No se encontraron hojas de trabajo para viajes con código ${codigoRuta}`, 
        data: [], 
        count: 0 
      };
    }

    // Mapear cada hoja a su versión detallada
    const hojasDetalladas = await Promise.all(hojas.map(hoja => this.mapHojaTrabajoDetalle(hoja)));

    return {
      message: `Hojas de trabajo encontradas para viajes con código ${codigoRuta}`,
      data: hojasDetalladas,
      count: hojasDetalladas.length
    };
  }
} 