import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateHojaTrabajoDto } from './dto/create-hoja-trabajo.dto';
import { UpdateHojaTrabajoDto } from './dto/update-hoja-trabajo.dto';
import { db } from '../drizzle/database';
import { hojaTrabajo } from '../drizzle/schema/hoja-trabajo';
import { buses } from '../drizzle/schema/bus';
import { choferes } from '../drizzle/schema/choferes';
import { eq } from 'drizzle-orm';
import { CreateHojaTrabajoAutomaticoDto } from './dto/create-hoja-trabajo.dto';
import { rutas } from '../drizzle/schema/rutas';
import { rutaDias } from '../drizzle/schema/ruta-dia';
import { dias } from '../drizzle/schema/dias';
import { frecuencias } from '../drizzle/schema/frecuencias';
import { EstadoHojaTrabajo } from './dto/create-hoja-trabajo.dto';
import { and, inArray } from 'drizzle-orm';

@Injectable()
export class CrearHojaTrabajoService {
  async createAutomatically(dto: CreateHojaTrabajoAutomaticoDto, idCooperativa: number) {
    const { numDias, fechaInicial } = dto;
    if (!numDias || !fechaInicial || !idCooperativa) {
      throw new BadRequestException('Faltan parámetros requeridos');
    }

    // 1. Obtener rutas de la cooperativa
    const rutasCoop = await db.select().from(rutas).where(and(
      eq(rutas.cooperativaId, idCooperativa),
      eq(rutas.estado, true)
    ));
    if (rutasCoop.length === 0) {
      throw new NotFoundException('No hay rutas para la cooperativa');
    }
    const rutasIds = rutasCoop.map(r => r.id);

    // 2. Obtener días de operación de cada ruta (solo tipo 'operacion')
    const rutasDias = await db.select().from(rutaDias).where(
      inArray(rutaDias.rutaId, rutasIds)
    );
    // Mapa: diaId -> [rutaId]
    const diasOperacionPorRuta: Record<number, number[]> = {};
    rutasDias.forEach(rd => {
      if (rd.tipo === 'operacion') {
        if (!diasOperacionPorRuta[rd.diaId]) diasOperacionPorRuta[rd.diaId] = [];
        diasOperacionPorRuta[rd.diaId].push(rd.rutaId);
      }
    });

    // 3. Obtener todos los días (para mapear nombre/código a id)
    const diasTodos = await db.select().from(dias);
    const mapDiaNombreId = Object.fromEntries(diasTodos.map(d => [d.nombre.toLowerCase(), d.id]));
    const mapDiaCodigoId = Object.fromEntries(diasTodos.map(d => [d.codigo.toLowerCase(), d.id]));

    // 4. Obtener buses libres de la cooperativa
    const busesLibres = await db.select().from(buses).where(and(
      eq(buses.cooperativa_id, idCooperativa),
      eq(buses.enUso, false),
      eq(buses.activo, true)
    ));
    const busesLibresIds = busesLibres.map(b => b.id);
    if (busesLibresIds.length === 0) {
      throw new BadRequestException('No hay buses libres disponibles');
    }

    // 5. Obtener choferes de la cooperativa
    const choferesCoop = await db.select().from(choferes).where(
      eq(choferes.cooperativaTransporteId, idCooperativa)
    );
    const choferesIds = choferesCoop.map(c => c.id);
    if (choferesIds.length === 0) {
      throw new BadRequestException('No hay choferes disponibles');
    }

    // 6. Para cada día desde fechaInicial hasta numDias
    const hojasAInsertar: typeof hojaTrabajo.$inferInsert[] = [];
    let fecha = new Date(fechaInicial);
    for (let i = 0; i < numDias; i++) {
      const diaSemana = fecha.getDay(); // 0=Domingo, 1=Lunes, ...
      // Buscar el id del día en la tabla dias
      let diaId: number | null = null;
      // Buscar por código (asumiendo 1=Lunes, 2=Martes...)
      for (const d of diasTodos) {
        if (Number(d.codigo) === diaSemana || Number(d.id) === diaSemana) {
          diaId = d.id;
          break;
        }
      }
      if (!diaId) {
        // Si no se encuentra por código, buscar por nombre
        const nombres = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
        diaId = mapDiaNombreId[nombres[diaSemana]];
      }
      if (!diaId) continue;
      // Rutas en operación ese día
      const rutasDelDia = diasOperacionPorRuta[diaId] || [];
      if (rutasDelDia.length === 0) {
        fecha.setDate(fecha.getDate() + 1);
        continue;
      }
      // 7. Obtener frecuencias libres de esas rutas
      const frecuenciasLibres = await db.select().from(frecuencias).where(and(
        inArray(frecuencias.rutaId, rutasDelDia),
        eq(frecuencias.enUso, false)
      ));
      const idFrecuenciasPorDia = frecuenciasLibres.map(f => f.id);
      const numeroFrecuenciaPorDia = idFrecuenciasPorDia.length;
      const numeroBuses = busesLibresIds.length;
      // 8. Decidir cuántos registros crear
      let registros = 0;
      if (numeroFrecuenciaPorDia > numeroBuses) {
        if (numeroBuses <= 5) registros = 4;
        else if (numeroBuses <= 15) registros = 7;
        else registros = numeroBuses - 8;
      } else {
        registros = numeroFrecuenciaPorDia;
      }
      // 9. Asignar bus, chofer y frecuencia a cada hoja de trabajo
      for (let j = 0; j < registros; j++) {
        const busId = busesLibresIds[j % busesLibresIds.length];
        const choferId = choferesIds[j % choferesIds.length];
        const frecDiaId = idFrecuenciasPorDia[j % idFrecuenciasPorDia.length];
        hojasAInsertar.push({
          busId: busId ?? null,
          choferId: choferId ?? null,
          frecDiaId: frecDiaId ?? null,
          estado: EstadoHojaTrabajo.PROGRAMADO,
          fechaSalida: fecha.toISOString().split('T')[0],
        });
      }
      fecha.setDate(fecha.getDate() + 1);
    }
    // 10. Insertar en hoja_trabajo
    if (hojasAInsertar.length === 0) {
      throw new BadRequestException('No hay hojas de trabajo a programar');
    }
    await db.insert(hojaTrabajo).values(hojasAInsertar);

    // Actualizar buses utilizados a enUso=true
    const busesUsados = Array.from(new Set(hojasAInsertar.map(h => h.busId).filter(id => id !== null)));
    if (busesUsados.length > 0) {
      await db.update(buses)
        .set({ enUso: true })
        .where(inArray(buses.id, busesUsados));
    }

    return { message: 'Hojas de trabajo creadas automáticamente', count: hojasAInsertar.length };
  }
}