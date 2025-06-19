import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateHojaTrabajoDto } from './dto/create-hoja-trabajo.dto';
import { UpdateHojaTrabajoDto } from './dto/update-hoja-trabajo.dto';
import { db } from '../drizzle/database';
import { hojaTrabajo } from '../drizzle/schema/hoja-trabajo';
import { buses } from '../drizzle/schema/bus';
import { choferes } from '../drizzle/schema/choferes';
import { frecuenciaDias } from '../drizzle/schema/frecuencia-dia';
import { eq, and, desc } from 'drizzle-orm';

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

    // Validar que la frecuencia del día existe
    const [frecDia] = await db.select().from(frecuenciaDias).where(eq(frecuenciaDias.id, createHojaTrabajoDto.frecDiaId));
    if (!frecDia) {
      throw new BadRequestException(`La frecuencia del día con ID ${createHojaTrabajoDto.frecDiaId} no existe`);
    }

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

  async findAll() {
    const all = await db.select().from(hojaTrabajo).orderBy(desc(hojaTrabajo.id));
    return { 
      message: 'Lista de hojas de trabajo obtenida exitosamente', 
      data: all,
      count: all.length
    };
  }

  async findOne(id: number) {
    const [found] = await db.select().from(hojaTrabajo).where(eq(hojaTrabajo.id, id));
    if (!found) {
      throw new NotFoundException(`No se encontró la hoja de trabajo con ID ${id}`);
    }
    return { 
      message: `Hoja de trabajo ${id} encontrada`, 
      data: found 
    };
  }

  async update(id: number, updateHojaTrabajoDto: UpdateHojaTrabajoDto) {
    // Verificar que la hoja de trabajo existe
    const [existing] = await db.select().from(hojaTrabajo).where(eq(hojaTrabajo.id, id));
    if (!existing) {
      throw new NotFoundException(`No se encontró la hoja de trabajo con ID ${id}`);
    }

    // Validar referencias si se están actualizando
    if (updateHojaTrabajoDto.busId !== undefined) {
      const [bus] = await db.select().from(buses).where(eq(buses.id, updateHojaTrabajoDto.busId));
      if (!bus) {
        throw new BadRequestException(`El bus con ID ${updateHojaTrabajoDto.busId} no existe`);
      }
    }

    if (updateHojaTrabajoDto.choferId !== undefined) {
      const [chofer] = await db.select().from(choferes).where(eq(choferes.id, updateHojaTrabajoDto.choferId));
      if (!chofer) {
        throw new BadRequestException(`El chofer con ID ${updateHojaTrabajoDto.choferId} no existe`);
      }
    }

    if (updateHojaTrabajoDto.frecDiaId !== undefined) {
      const [frecDia] = await db.select().from(frecuenciaDias).where(eq(frecuenciaDias.id, updateHojaTrabajoDto.frecDiaId));
      if (!frecDia) {
        throw new BadRequestException(`La frecuencia del día con ID ${updateHojaTrabajoDto.frecDiaId} no existe`);
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

    const [deleted] = await db.delete(hojaTrabajo)
      .where(eq(hojaTrabajo.id, id))
      .returning();

    return { 
      message: `Hoja de trabajo ${id} eliminada exitosamente`, 
      data: deleted 
    };
  }

  // Métodos adicionales útiles
  async findByBus(busId: number) {
    const hojas = await db.select().from(hojaTrabajo).where(eq(hojaTrabajo.busId, busId));
    return { 
      message: `Hojas de trabajo del bus ${busId}`, 
      data: hojas,
      count: hojas.length
    };
  }

  async findByChofer(choferId: number) {
    const hojas = await db.select().from(hojaTrabajo).where(eq(hojaTrabajo.choferId, choferId));
    return { 
      message: `Hojas de trabajo del chofer ${choferId}`, 
      data: hojas,
      count: hojas.length
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
} 