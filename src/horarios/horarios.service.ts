import { Injectable } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { db } from '../drizzle/database';
import { schema } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class HorariosService {
  async create(createHorarioDto: CreateHorarioDto) {
    // Mapear campos del DTO a los del esquema (camelCase)
    const nuevoHorario = await db.insert(schema.horarios).values({
      frecuenciaId: createHorarioDto.frecuencia_id,
      fechaSalida: createHorarioDto.fecha_salida,
      fechaLlegada: createHorarioDto.fecha_llegada,
      hojaTrabajoId: createHorarioDto.hoja_trabajo_id,
      horaSalidaProg: createHorarioDto.hora_salida_prog,
      horaLlegadaProg: createHorarioDto.hora_llegada_prog,
      horaSalidaReal: createHorarioDto.hora_salida_real,
      horaLlegadaReal: createHorarioDto.hora_llegada_real,
      estado: 'creada',
    } as any).returning();
    return { message: 'Horario creado', data: nuevoHorario[0] };
  }

  async findAll(query?: any) {
    // Obtener todos los horarios de la base de datos
    const horarios = await db.select().from(schema.horarios);
    return { message: 'Lista de horarios', data: horarios };
  }

  async findOne(id: number) {
    // Obtener un horario por id de la base de datos
    const horario = await db.select().from(schema.horarios).where(eq(schema.horarios.id, id));
    if (horario.length === 0) {
      return { message: `No se encontró el horario con id ${id}` };
    }
    return { message: `Horario ${id}`, data: horario[0] };
  }

  async update(id: number, updateHorarioDto: UpdateHorarioDto) {
    // Solo incluir campos definidos y válidos
    const fieldsToUpdate: any = {};
    if (updateHorarioDto.frecuencia_id !== undefined) fieldsToUpdate.frecuenciaId = updateHorarioDto.frecuencia_id;
    if (updateHorarioDto.fecha_salida !== undefined) fieldsToUpdate.fechaSalida = updateHorarioDto.fecha_salida;
    if (updateHorarioDto.fecha_llegada !== undefined) fieldsToUpdate.fechaLlegada = updateHorarioDto.fecha_llegada;
    if (updateHorarioDto.hoja_trabajo_id !== undefined) fieldsToUpdate.hojaTrabajoId = updateHorarioDto.hoja_trabajo_id;
    if (updateHorarioDto.hora_salida_prog !== undefined) fieldsToUpdate.horaSalidaProg = updateHorarioDto.hora_salida_prog;
    if (updateHorarioDto.hora_llegada_prog !== undefined) fieldsToUpdate.horaLlegadaProg = updateHorarioDto.hora_llegada_prog;
    if (updateHorarioDto.hora_salida_real !== undefined) fieldsToUpdate.horaSalidaReal = updateHorarioDto.hora_salida_real;
    if (updateHorarioDto.hora_llegada_real !== undefined) fieldsToUpdate.horaLlegadaReal = updateHorarioDto.hora_llegada_real;
    // Puedes agregar estado si lo permites actualizar

    if (Object.keys(fieldsToUpdate).length === 0) {
      return { message: 'No hay campos válidos para actualizar.' };
    }

    const updated = await db.update(schema.horarios)
      .set(fieldsToUpdate)
      .where(eq(schema.horarios.id, id))
      .returning();
    if (updated.length === 0) {
      return { message: `No se pudo actualizar el horario con id ${id}` };
    }
    return { message: `Horario ${id} actualizado`, data: updated[0] };
  }

  async remove(id: number) {
    // Eliminar el horario de la base de datos
    const deleted = await db.delete(schema.horarios).where(eq(schema.horarios.id, id)).returning();
    if (deleted.length === 0) {
      return { message: `No se pudo eliminar el horario con id ${id}` };
    }
    return { message: `Horario ${id} eliminado`, data: deleted[0] };
  }
} 